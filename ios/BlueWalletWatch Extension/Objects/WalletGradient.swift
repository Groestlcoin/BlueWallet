//
//  WalletGradient.swift
//  BlueWalletWatch Extension
//
//  Created by Marcos Rodriguez on 3/23/19.

//

import Foundation

enum WalletGradient: String {
  case SegwitHD = "HDsegwitP2SH"
  case Segwit = "segwitP2SH"
  case LightningCustodial = "lightningCustodianWallet"
  case SegwitNative = "HDsegwitBech32"
  case WatchOnly = "watchOnly"
  case MultiSig = "HDmultisig"
  
  var imageString: String{
    switch self {
    case .Segwit:
      return "wallet"
    case .SegwitNative:
      return "walletHDSegwitNative"
    case .SegwitHD:
      return "walletHD"
    case .WatchOnly:
      return "walletWatchOnly"
    case .LightningCustodial:
      return "walletLightningCustodial"
    case .MultiSig:
      return "watchMultisig"
    }
  }
}
