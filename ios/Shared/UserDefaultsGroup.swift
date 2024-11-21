//
//  UserDefaultsGroup.swift
//  MarketWidgetExtension
//
//  Created by Marcos Rodriguez on 10/31/20.
//  Copyright © 2020 BlueWallet. All rights reserved.
//

import Foundation

struct UserDefaultsElectrumSettings {
    var host: String?
    var port: UInt16?
    var sslPort: UInt16?
}

let hardcodedPeers = [
    UserDefaultsElectrumSettings(host: "electrum1.groestlcoin.org", port: 50001, sslPort: 50002),
    UserDefaultsElectrumSettings(host: "electrum2.groestlcoin.org", port: 50001, sslPort: 50002),
    UserDefaultsElectrumSettings(host: "electrum11.groestlcoin.org", port: 50001, sslPort: 50002),
    UserDefaultsElectrumSettings(host: "electrum12.groestlcoin.org", port: 50001, sslPort: 50002),
    UserDefaultsElectrumSettings(host: "electrum13.groestlcoin.org", port: 50001, sslPort: 50002),
]

let DefaultElectrumPeers = [
    UserDefaultsElectrumSettings(host: "electrum1.groestlcoin.org", port: 50001, sslPort: 50002), //
] + hardcodedPeers

class UserDefaultsGroup {
  static private let suite = UserDefaults(suiteName: UserDefaultsGroupKey.GroupName.rawValue)

  static func getElectrumSettings() -> UserDefaultsElectrumSettings {
    guard let electrumSettingsHost = suite?.string(forKey: UserDefaultsGroupKey.ElectrumSettingsHost.rawValue) else {
      return DefaultElectrumPeers.randomElement()!
    }

    let electrumSettingsTCPPort = suite?.value(forKey: UserDefaultsGroupKey.ElectrumSettingsTCPPort.rawValue) ?? 50001
    let electrumSettingsSSLPort = suite?.value(forKey: UserDefaultsGroupKey.ElectrumSettingsSSLPort.rawValue) ?? 50002

    let host = electrumSettingsHost
    let sslPort = electrumSettingsSSLPort
    let port = electrumSettingsTCPPort

    return UserDefaultsElectrumSettings(host: host, port: port as! UInt16, sslPort: sslPort as! UInt16)
  }

  static func getAllWalletsBalance() -> Double {
    guard let allWalletsBalance = suite?.string(forKey: UserDefaultsGroupKey.AllWalletsBalance.rawValue) else {
      return 0
    }

    return Double(allWalletsBalance) ?? 0
  }

  // Int: EPOCH value, Bool: Latest transaction is unconfirmed
  static func getAllWalletsLatestTransactionTime() -> LatestTransaction {
    guard let allWalletsTransactionTime = suite?.string(forKey: UserDefaultsGroupKey.AllWalletsLatestTransactionTime.rawValue) else {
      return LatestTransaction(isUnconfirmed: false, epochValue: 0)
    }

    if allWalletsTransactionTime == UserDefaultsGroupKey.LatestTransactionIsUnconfirmed.rawValue {
      return LatestTransaction(isUnconfirmed: true, epochValue: 0)
    } else {
      return LatestTransaction(isUnconfirmed: false, epochValue: Int(allWalletsTransactionTime))
    }
  }

}
