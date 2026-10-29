//
//  WalletAppShortcuts.swift
//  BlueWallet


import AppIntents
import Foundation

@available(iOS 18.0, visionOS 2.0, *)
private struct SendShortcutIntent: AppIntent {
    static let title = LocalizedStringResource("APP_SHORTCUT_SEND", table: "InfoPlist")

    func perform() async throws -> some IntentResult & OpensIntent {
        .result(opensIntent: OpenURLIntent(URL(string: "bluewallet://send")!))
    }
}

@available(iOS 18.0, visionOS 2.0, *)
private struct ReceiveShortcutIntent: AppIntent {
    static let title = LocalizedStringResource("APP_SHORTCUT_RECEIVE", table: "InfoPlist")

    func perform() async throws -> some IntentResult & OpensIntent {
        .result(opensIntent: OpenURLIntent(URL(string: "bluewallet://receive")!))
    }
}

@available(iOS 18.0, visionOS 2.0, *)
private struct ScanShortcutIntent: AppIntent {
    static let title = LocalizedStringResource("APP_SHORTCUT_SCAN", table: "InfoPlist")

    func perform() async throws -> some IntentResult & OpensIntent {
        .result(opensIntent: OpenURLIntent(URL(string: "bluewallet://scan")!))
    }
}

@available(iOS 18.0, visionOS 2.0, *)
private struct ManageWalletsShortcutIntent: AppIntent {
    static let title = LocalizedStringResource("APP_SHORTCUT_MANAGE_WALLETS", table: "InfoPlist")

    func perform() async throws -> some IntentResult & OpensIntent {
        .result(opensIntent: OpenURLIntent(URL(string: "bluewallet://manage-wallets")!))
    }
}

@available(iOS 16.4, visionOS 1.0, *)
struct WalletAppShortcuts: AppShortcutsProvider {
    static let shortcutTileColor: ShortcutTileColor = .blue

    static var appShortcuts: [AppShortcut] {
        let priceShortcut = AppShortcut(
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

        if #available(iOS 18.0, visionOS 2.0, *) {
            return [
                priceShortcut,
                AppShortcut(
                    intent: SendShortcutIntent(),
                    phrases: ["Send with \(.applicationName)"],
                    shortTitle: LocalizedStringResource("APP_SHORTCUT_SEND", table: "InfoPlist"),
                    systemImageName: "paperplane"
                ),
                AppShortcut(
                    intent: ReceiveShortcutIntent(),
                    phrases: ["Receive with \(.applicationName)"],
                    shortTitle: LocalizedStringResource("APP_SHORTCUT_RECEIVE", table: "InfoPlist"),
                    systemImageName: "tray.and.arrow.down"
                ),
                AppShortcut(
                    intent: ScanShortcutIntent(),
                    phrases: ["Scan with \(.applicationName)"],
                    shortTitle: LocalizedStringResource("APP_SHORTCUT_SCAN", table: "InfoPlist"),
                    systemImageName: "qrcode.viewfinder"
                ),
                AppShortcut(
                    intent: ManageWalletsShortcutIntent(),
                    phrases: ["Manage wallets with \(.applicationName)"],
                    shortTitle: LocalizedStringResource("APP_SHORTCUT_MANAGE_WALLETS", table: "InfoPlist"),
                    systemImageName: "wallet.pass"
                ),
            ]
        }

        return [priceShortcut]
    }
}
