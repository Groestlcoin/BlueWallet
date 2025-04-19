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
                AppShortcutPhrase<PriceIntent>("Market rate for Groestlcoin in \(\.$fiatCurrency) using ${applicationName}"),
                AppShortcutPhrase<PriceIntent>("Get the current Groestlcoin market rate in \(\.$fiatCurrency) with ${applicationName}"),
                AppShortcutPhrase<PriceIntent>("What's the current Groestlcoin rate in \(\.$fiatCurrency) using ${applicationName}?"),
                AppShortcutPhrase<PriceIntent>("Show me the current Groestlcoin price in \(\.$fiatCurrency) via ${applicationName}"),
                AppShortcutPhrase<PriceIntent>("Retrieve Groestlcoin rate in \(\.$fiatCurrency) from ${applicationName}")
            ],
            shortTitle: "Market Rate",
            systemImageName: "bitcoinsign.circle"
        )

    }
}
