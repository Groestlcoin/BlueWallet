//
//  WalletAppShortcuts.swift
//  BlueWallet


import AppIntents

@available(iOS 16.4, *)
struct WalletAppShortcuts: AppShortcutsProvider {

    @AppShortcutsBuilder
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: PriceIntent(),
            phrases: [
                AppShortcutPhrase<PriceIntent>("Market rate for Groestlcoin in \(\.$fiatCurrency) using GRS BlueWallet"),
                AppShortcutPhrase<PriceIntent>("Get the current Groestlcoin market rate in \(\.$fiatCurrency) with GRS BlueWallet"),
                AppShortcutPhrase<PriceIntent>("What's the current Groestlcoin rate in \(\.$fiatCurrency) using GRS BlueWallet?"),
                AppShortcutPhrase<PriceIntent>("Show me the current Groestlcoin price in \(\.$fiatCurrency) via GRS BlueWallet"),
                AppShortcutPhrase<PriceIntent>("Retrieve Groestlcoin rate in \(\.$fiatCurrency) from GRS BlueWallet")
            ],
            shortTitle: "Market Rate",
            systemImageName: "bitcoinsign.circle"
        )

    }
}
