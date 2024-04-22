//
//  WalletInformationAndMarketWidget.swift
//  WalletInformationAndMarketWidget
//
//  Created by Marcos Rodriguez on 10/29/20.
//  Copyright © 2020 BlueWallet. All rights reserved.
//

import WidgetKit
import SwiftUI

struct WalletInformationAndMarketWidgetProvider: TimelineProvider {
  typealias Entry = WalletInformationAndMarketWidgetEntry
  static var lastSuccessfulEntry: WalletInformationAndMarketWidgetEntry?

  func placeholder(in context: Context) -> WalletInformationAndMarketWidgetEntry {
    return WalletInformationAndMarketWidgetEntry.placeholder
  }

  func getSnapshot(in context: Context, completion: @escaping (WalletInformationAndMarketWidgetEntry) -> ()) {
    let entry: WalletInformationAndMarketWidgetEntry
    if (context.isPreview) {
      entry = WalletInformationAndMarketWidgetEntry(date: Date(), marketData: MarketData(nextBlock: "1", sats: "100,000,000", price: "$1", rate: 1), allWalletsBalance: WalletData(balance: 1000000, latestTransactionTime: LatestTransaction(isUnconfirmed: false, epochValue: 1568804029000)))
    } else {
      entry = WalletInformationAndMarketWidgetEntry(date: Date(), marketData: emptyMarketData)
    }
    completion(entry)
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    var entries: [WalletInformationAndMarketWidgetEntry] = []
    if (context.isPreview) {
      let entry = WalletInformationAndMarketWidgetEntry(date: Date(), marketData: MarketData(nextBlock: "1", sats: "100,000,000", price: "$1", rate: 1), allWalletsBalance: WalletData(balance: 1000000, latestTransactionTime: LatestTransaction(isUnconfirmed: false, epochValue: 1568804029000)))
      entries.append(entry)
      let timeline = Timeline(entries: entries, policy: .atEnd)
      completion(timeline)
    } else {
      let userPreferredCurrency = Currency.getUserPreferredCurrency()
      let allwalletsBalance = WalletData(balance: UserDefaultsGroup.getAllWalletsBalance(), latestTransactionTime: UserDefaultsGroup.getAllWalletsLatestTransactionTime())

      MarketAPI.fetchMarketData(currency: userPreferredCurrency) { (result, error) in
        let entry: WalletInformationAndMarketWidgetEntry

        if let result = result {
          entry = WalletInformationAndMarketWidgetEntry(date: Date(), marketData: result, allWalletsBalance: allwalletsBalance)
          WalletInformationAndMarketWidgetProvider.lastSuccessfulEntry = entry
        } else {
          // Use the last successful entry if available
          if let lastEntry = WalletInformationAndMarketWidgetProvider.lastSuccessfulEntry {
            entry = lastEntry
          } else {
            // Fallback to a default entry if no successful entry is available
            entry = WalletInformationAndMarketWidgetEntry.placeholder
          }
        }
        entries.append(entry)
        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
      }
    }
  }
}

struct WalletInformationAndMarketWidgetEntry: TimelineEntry {
  let date: Date
  let marketData: MarketData
  var allWalletsBalance: WalletData = WalletData(balance: 0)
  static var placeholder = WalletInformationAndMarketWidgetEntry(date: Date(), marketData: MarketData(nextBlock: "...", sats: "...", price: "...", rate: 0), allWalletsBalance: WalletData(balance: 0, latestTransactionTime: LatestTransaction(isUnconfirmed: false, epochValue: 1568804029000)))
}

struct WalletInformationAndMarketWidgetEntryView : View {
  @Environment(\.widgetFamily) var family
  let entry: WalletInformationAndMarketWidgetEntry


  var WalletBalance: some View {
    WalletInformationView(allWalletsBalance: entry.allWalletsBalance, marketData: entry.marketData).background(Color.widgetBackground)
  }

  var MarketStack: some View {
    MarketView(marketData: entry.marketData)
  }

  var SendReceiveButtonsView: some View {
    SendReceiveButtons().padding(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/, /*@START_MENU_TOKEN@*/10/*@END_MENU_TOKEN@*/)
  }

  var body: some View {
    if family == .systemLarge {
      HStack(alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/, spacing: /*@START_MENU_TOKEN@*/nil/*@END_MENU_TOKEN@*/, content: {
        VStack(alignment: .leading, spacing: nil, content: {
                HStack(content: {
                  WalletBalance.padding()
                }).background(Color.widgetBackground)
                HStack(content: {
                        MarketStack        }).padding()
                SendReceiveButtonsView        }).background(Color(.lightGray).opacity(0.77))

      })

    } else {
      HStack(content: {
        WalletBalance.padding()
        HStack(content: {
          MarketStack.padding()
        }).background(Color(.lightGray).opacity(0.77))
      }).background(Color.widgetBackground)

    }
  }
}

struct WalletInformationAndMarketWidget: Widget {
  let kind: String = "WalletInformationAndMarketWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: WalletInformationAndMarketWidgetProvider()) { entry in
      WalletInformationAndMarketWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("Wallet and Market")
    .description("View your total wallet balance and network prices.").supportedFamilies([.systemMedium, .systemLarge])
  }
}

struct WalletInformationAndMarketWidget_Previews: PreviewProvider {
  static var previews: some View {
    WalletInformationAndMarketWidgetEntryView(entry: WalletInformationAndMarketWidgetEntry(date: Date(), marketData: MarketData(nextBlock: "1", sats: "100,000,000", price: "$1", rate: 0), allWalletsBalance: WalletData(balance: 10000, latestTransactionTime: LatestTransaction(isUnconfirmed: false, epochValue: 1568804029000))))
      .previewContext(WidgetPreviewContext(family: .systemMedium))
    WalletInformationAndMarketWidgetEntryView(entry: WalletInformationAndMarketWidgetEntry(date: Date(), marketData: MarketData(nextBlock: "1", sats: "100,000,000", price: "$1", rate: 0), allWalletsBalance: WalletData(balance: 10000, latestTransactionTime: LatestTransaction(isUnconfirmed: false, epochValue: 1568804029000))))
      .previewContext(WidgetPreviewContext(family: .systemLarge))
  }
}
