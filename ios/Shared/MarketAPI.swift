//
//  MarketAPI.swift
//
//  Created by Marcos Rodriguez on 11/2/19.
//

//

import Foundation

class MarketAPI {

    private static func buildURLString(source: String, endPointKey: String) -> String {
        switch source {
        case "CoinGecko":
            return "https://api.coingecko.com/api/v3/simple/price?ids=groestlcoin&vs_currencies=\(endPointKey.lowercased())"
        default:
            return "https://api.coingecko.com/api/v3/simple/price?ids=groestlcoin&vs_currencies=\(endPointKey.lowercased())"
        }
    }

    private static func handleDefaultData(data: Data, source: String, endPointKey: String) throws -> WidgetDataStore? {
        guard let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? [String: Any] else {
            throw CurrencyError(errorDescription: "JSON parsing error.")
        }

        return try parseJSONBasedOnSource(json: json, source: source, endPointKey: endPointKey)
    }

    private static func parseJSONBasedOnSource(json: [String: Any], source: String, endPointKey: String) throws -> WidgetDataStore? {
        var latestRateDataStore: WidgetDataStore?

        switch source {
        case "CoinGecko":
            if let bitcoinDict = json["groestlcoin"] as? [String: Any],
               let rateDouble = bitcoinDict[endPointKey.lowercased()] as? Double {
                let lastUpdatedString = ISO8601DateFormatter().string(from: Date())
                latestRateDataStore = WidgetDataStore(rate: String(rateDouble), lastUpdate: lastUpdatedString, rateDouble: rateDouble)
                return latestRateDataStore
            } else {
                throw CurrencyError(errorDescription: "Data formatting error for source: \(source)")
            }
        default:
            throw CurrencyError(errorDescription: "Unsupported data source \(source)")
        }
    }

    private static func handleBNRData(data: Data) async throws -> WidgetDataStore? {
        let parser = XMLParser(data: data)
        let delegate = BNRXMLParserDelegate()
        parser.delegate = delegate
        if parser.parse(), let usdToRonRate = delegate.usdRate {
            let coinGeckoUrl = URL(string: "https://api.coingecko.com/api/v3/simple/price?ids=groestlcoin&vs_currencies=usd")!
            let (data, _) = try await URLSession.shared.data(from: coinGeckoUrl)
            if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
               let bitcoinDict = json["groestlcoin"] as? [String: Double],
               let btcToUsdRate = bitcoinDict["usd"] {
                let btcToRonRate = btcToUsdRate * usdToRonRate
                let lastUpdatedString = ISO8601DateFormatter().string(from: Date())
                let latestRateDataStore = WidgetDataStore(rate: String(btcToRonRate), lastUpdate: lastUpdatedString, rateDouble: btcToRonRate)
                return latestRateDataStore
            } else {
                throw CurrencyError()
            }
        } else {
            throw CurrencyError(errorDescription: "XML parsing error.")
        }
    }


  static func fetchPrice(currency: String) async throws -> WidgetDataStore? {
         let currencyToFiatUnit = fiatUnit(currency: currency)
         guard let source = currencyToFiatUnit?.source, let endPointKey = currencyToFiatUnit?.endPointKey else {
             throw CurrencyError(errorDescription: "Invalid currency unit or endpoint.")
         }

         let urlString = buildURLString(source: source, endPointKey: endPointKey)
         guard let url = URL(string: urlString) else {
             throw CurrencyError(errorDescription: "Invalid URL.")
         }

         return try await fetchData(url: url, source: source, endPointKey: endPointKey)
     }

     private static func fetchData(url: URL, source: String, endPointKey: String, retries: Int = 3) async throws -> WidgetDataStore? {
         do {
             let (data, _) = try await URLSession.shared.data(from: url)
                 return try handleDefaultData(data: data, source: source, endPointKey: endPointKey)
             }
         } catch {
             if retries > 0 {
                 return try await fetchData(url: url, source: source, endPointKey: endPointKey, retries: retries - 1)
             } else {
                 throw error
             }
         }
     }

    static func fetchPrice(currency: String, completion: @escaping ((WidgetDataStore?, Error?) -> Void)) {
        Task {
            do {
                if let dataStore = try await fetchPrice(currency: currency) {
                    completion(dataStore, nil)
                } else {
                    completion(nil, CurrencyError(errorDescription: "No data received."))
                }
            } catch {
                completion(nil, error)
            }
        }
    }
}
