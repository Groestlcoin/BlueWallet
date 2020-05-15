module.exports = {
  _: {
    storage_is_encrypted: 'Lưu trữ của bạn được mã hoá. Mật khẩu được yêu cầu để giải mã',
    enter_password: 'Enter password',
    bad_password: 'Bad password, try again',
    never: 'never',
    continue: 'Continue',
    ok: 'OK',
  },
  wallets: {
    select_wallet: 'Select Wallet',
    options: 'options',
    createBitcoinWallet:
      'You currently do not have a Groestlcoin wallet. In order to fund a Lightning wallet, a Groestlcoin wallet needs to be created or imported. Would you like to continue anyway?',
    list: {
      app_name: 'Groestlcoin BlueWallet',
      title: 'wallets',
      header: 'A wallet represents a pair of a secret (private key) and an address' + 'you can share to receive coins.',
      add: 'Add Wallet',
      create_a_wallet: 'Add a wallet',
      create_a_wallet1: "It's free and you can create",
      create_a_wallet2: 'as many as you like',
      create_a_button: 'Add now',
      latest_transaction: 'latest transaction',
      empty_txs1: 'Your transactions will appear here,',
      empty_txs2: 'none at the moment',
      empty_txs1_lightning:
        'Lightning wallet should be used for your daily transactions. Fees are unfairly cheap and speed is blazing fast.',
      empty_txs2_lightning: '\nTo start using it tap on "manage funds" and topup your balance.',
      tap_here_to_buy: 'Tap here to buy Groestlcoin',
    },
    reorder: {
      title: 'Reorder Wallets',
    },
    add: {
      title: 'add wallet',
      description:
        'You can either scan backup paper wallet (in WIF - Wallet Import Format), or create a new wallet. Segwit wallets supported by default.',
      scan: 'Scan',
      create: 'Create',
      label_new_segwit: 'New SegWit',
      label_new_lightning: 'New Lightning',
      wallet_name: 'name',
      wallet_type: 'type',
      or: 'or',
      import_wallet: 'Import wallet',
      imported: 'Imported',
      coming_soon: 'Coming soon',
      lightning: 'Lightning',
      bitcoin: 'Groestlcoin',
    },
    details: {
      title: 'Wallet',
      address: 'Address',
      master_fingerprint: 'Master fingerprint',
      type: 'Type',
      label: 'Label',
      destination: 'destination',
      description: 'description',
      are_you_sure: 'Are you sure?',
      yes_delete: 'Yes, delete',
      no_cancel: 'No, cancel',
      delete: 'Delete',
      save: 'Save',
      delete_this_wallet: 'Delete this wallet',
      export_backup: 'Export / backup',
      buy_bitcoin: 'Buy Groestlcoin',
      show_xpub: 'Show wallet XPUB',
    },
    export: {
      title: 'wallet export',
    },
    xpub: {
      title: 'wallet XPUB',
      copiedToClipboard: 'Copied to clipboard.',
    },
    import: {
      title: 'import',
      explanation:
        "Write here your mnemonic, private key, WIF, or anything you've got. Groestlcoin BlueWallet will do its best to guess the correct format and import your wallet",
      imported: 'Imported',
      error: 'Failed to import. Please, make sure that the provided data is valid.',
      success: 'Success',
      do_import: 'Import',
      scan_qr: 'or scan QR code instead?',
    },
    scanQrWif: {
      go_back: 'Go Back',
      cancel: 'Cancel',
      decoding: 'Decoding',
      input_password: 'Input password',
      password_explain: 'This is BIP38 encrypted private key',
      bad_password: 'Bad password',
      wallet_already_exists: 'Such wallet already exists',
      bad_wif: 'Bad WIF',
      imported_wif: 'Imported WIF ',
      with_address: ' with address ',
      imported_segwit: 'Imported SegWit',
      imported_legacy: 'Imported Legacy',
      imported_watchonly: 'Imported Watch-only',
    },
  },
  transactions: {
    list: {
      tabBarLabel: 'Transactions',
      title: 'transactions',
      description: 'A list of ingoing or outgoing transactions of your wallets',
      conf: 'conf',
    },
    details: {
      title: 'Transaction',
      from: 'Input',
      to: 'Output',
      copy: 'Copy',
      transaction_details: 'Transaction details',
      show_in_block_explorer: 'View in block explorer',
    },
  },
  send: {
    header: 'Send',
    details: {
      title: 'create transaction',
      amount_field_is_not_valid: 'Amount field is not valid',
      fee_field_is_not_valid: 'Fee field is not valid',
      address_field_is_not_valid: 'Address field is not valid',
      total_exceeds_balance: 'The sending amount exceeds the available balance.',
      create_tx_error: 'There was an error creating the transaction. Please, make sure the address is valid.',
      address: 'address',
      amount_placeholder: 'amount to send (in GRS)',
      fee_placeholder: 'plus transaction fee (in GRS)',
      note_placeholder: 'note to self',
      cancel: 'Cancel',
      scan: 'Scan',
      send: 'Send',
      create: 'Create',
      remaining_balance: 'Remaining balance',
    },
    confirm: {
      header: 'Confirm',
      sendNow: 'Send now',
    },
    success: {
      done: 'Done',
    },
    create: {
      details: 'Details',
      title: 'create transaction',
      error: 'Error creating transaction. Invalid address or send amount?',
      go_back: 'Go Back',
      this_is_hex: `This is your transaction's hex, signed and ready to be broadcasted to the network.`,
      to: 'To',
      amount: 'Amount',
      fee: 'Fee',
      tx_size: 'TX size',
      satoshi_per_byte: 'Gro per byte',
      memo: 'Memo',
      broadcast: 'Broadcast',
      not_enough_fee: 'Not enough fee. Increase the fee',
    },
  },
  receive: {
    header: 'Receive',
    details: {
      title: 'Share this address with payer',
      share: 'share',
      copiedToClipboard: 'Copied to clipboard.',
      label: 'Description',
      create: 'Create',
      setAmount: 'Receive with amount',
    },
    scan_lnurl: 'Scan to receive',
  },
  buyBitcoin: {
    header: 'Buy Groestlcoin',
    tap_your_address: 'Tap your address to copy it to clipboard:',
    copied: 'Copied to Clipboard!',
  },
  settings: {
    header: 'settings',
    plausible_deniability: 'Plausible deniability...',
    storage_not_encrypted: 'Storage: not encrypted',
    storage_encrypted: 'Storage: encrypted',
    password: 'Password',
    password_explain: 'Create the password you will use to decrypt the storage',
    retype_password: 'Re-type password',
    passwords_do_not_match: 'Passwords do not match',
    encrypt_storage: 'Encrypt storage',
    lightning_settings: 'Lightning Settings',
    lightning_settings_explain:
      'To connect to your own LND node please install LndHub' +
      " and put its URL here in settings. Leave blank to use Groestlcoin BlueWallet's LNDHub (lndhub.groestlcoin.org). Wallets created after saving changes will connect to the specified LNDHub.",
    electrum_settings: 'Electrum Settings',
    electrum_settings_explain: 'Set to blank to use default',
    save: 'Save',
    about: 'About',
    language: 'Language',
    currency: 'Currency',
    advanced_options: 'Advanced Options',
    enable_advanced_mode: 'Enable advanced mode',
  },
  plausibledeniability: {
    title: 'Plausible Deniability',
    help:
      'Under certain circumstances, you might be forced to disclose a ' +
      'password. To keep your coins safe, Groestlcoin BlueWallet can create another ' +
      'encrypted storage, with a different password. Under pressure, ' +
      'you can disclose this password to a 3rd party. If entered in ' +
      "Groestlcoin BlueWallet, it will unlock new 'fake' storage. This will seem " +
      'legit to a 3rd party, but will secretly keep your main storage ' +
      'with coins safe.',
    help2: 'New storage will be fully functional, and you can store some ' + 'minimum amounts there so it looks more believable.',
    create_fake_storage: 'Create fake encrypted storage',
    go_back: 'Go Back',
    create_password: 'Create a password',
    create_password_explanation: 'Password for fake storage should not match password for your main storage',
    password_should_not_match: 'Password for fake storage should not match password for your main storage',
    retype_password: 'Retype password',
    passwords_do_not_match: 'Passwords do not match, try again',
    success: 'Success',
  },
  lnd: {
    title: 'manage funds',
    choose_source_wallet: 'Choose a source wallet',
    refill_lnd_balance: 'Refill Lightning wallet balance',
    refill: 'Refill',
    withdraw: 'Withdraw',
    expired: 'Expired',
    placeholder: 'Invoice',
    sameWalletAsInvoiceError: 'You can not pay an invoice with the same wallet used to create it.',
  },
  pleasebackup: {
    title: 'Your wallet is created...',
    text:
      "Please take a moment to write down this mnemonic phrase on a piece of paper. It's your backup you can use to restore the wallet on other device.",
    ok: 'OK, I wrote this down!',
  },
  lndViewInvoice: {
    wasnt_paid_and_expired: 'This invoice was not paid for and has expired',
    has_been_paid: 'This invoice has been paid for',
    please_pay: 'Please pay',
    sats: 'sats',
    for: 'For:',
    additional_info: 'Additional Information',
    open_direct_channel: 'Open direct channel with this node:',
  },
};
