//
//  WalletAppShortcuts.swift
//  BlueWallet


import AppIntents

@available(iOS 16.4, *)
struct WalletAppShortcuts: AppShortcutsProvider {
    static let shortcutTileColor: ShortcutTileColor = .blue

    @AppShortcutsBuilder
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: PriceIntent(),
            phrases: [
                "Get the Groestlcoin price with ${applicationName}",
                "What's the Groestlcoin price using ${applicationName}",
                "Get the Groestlcoin price in \(\.$fiatCurrency) with ${applicationName}",
                "What's the Groestlcoin price in \(\.$fiatCurrency) using ${applicationName}",
                "Show the Groestlcoin market rate in \(\.$fiatCurrency) with ${applicationName}"
            ],
            shortTitle: "Groestlcoin Price",
            systemImageName: "bitcoinsign.circle.fill"
        )
    }
}
