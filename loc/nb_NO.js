module.exports = {
  _: {
    storage_is_encrypted: 'Lagringen din er kryptert. Passord er nødvendig for å dekryptere det',
    enter_password: 'Oppgi passord',
    bad_password: 'Feil passord, prøv igjen',
    never: 'aldri',
    continue: 'Fortsett',
    ok: 'OK',
  },
  wallets: {
    select_wallet: 'Velg Lommebok',
    options: 'innstillinger',
    createBitcoinWallet:
      'Du har ingen Groestlcoin-lommebok. For å finansiere en Lightning-lommebok, må en Groestlcoin-lommebok være opprettet eller importert. Vil du fortsette uansett?',
    list: {
      app_name: 'BlueWallet',
      title: 'lommebøker',
      header: 'En lommebok representerer en hemmelighet (privat nøkkel) og en adresse ' + ' du kan dele for å motta kryptovaluta.',
      add: 'Legg til lommebok',
      create_a_wallet: 'Lag en lommebok',
      create_a_wallet1: 'Det er gratis, og du kan lage',
      create_a_wallet2: 'så mange du vil',
      latest_transaction: 'siste transaksjonen',
      empty_txs1: 'Dine transaksjoner vil vises her,',
      empty_txs2: 'ingen for øyeblikket',
      empty_txs1_lightning:
        'Lightning wallet should be used for your daily transactions. Fees are unfairly cheap and speed is blazing fast.',
      empty_txs2_lightning: '\nTo start using it tap on "manage funds" and topup your balance.',
      tap_here_to_buy: 'Trykk her for å kjøpe Groestlcoin',
    },
    reorder: {
      title: 'Omorganisere lommebøker',
    },
    add: {
      title: 'legg til lommebok',
      description:
        'Du kan enten skanne en backup papirlommebok (i WIF - Wallet Import Format), eller opprett en ny lommebok. Segwit lommebøker støttes som standard.',
      scan: 'Skann',
      create: 'Lag',
      label_new_segwit: 'Ny SegWit',
      label_new_lightning: 'Ny Lightning',
      wallet_name: 'navn',
      wallet_type: 'type',
      or: 'eller',
      import_wallet: 'Importer lommeboken',
      imported: 'Importert',
      coming_soon: 'Kommer snart',
      lightning: 'Lightning',
      bitcoin: 'Groestlcoin',
    },
    details: {
      title: 'Lommebok',
      address: 'Adresse',
      master_fingerprint: 'Master fingerprint',
      type: 'Type',
      label: 'Merkelapp',
      destination: 'mål',
      description: 'beskrivelse',
      are_you_sure: 'Er du sikker?',
      yes_delete: 'Ja, slett',
      no_cancel: 'Nei, avbryt',
      delete: 'Slett',
      save: 'Lagre',
      delete_this_wallet: 'Slett denne lommeboken',
      export_backup: 'Eksporter / backup',
      buy_bitcoin: 'Kjøp Groestlcoin',
      show_xpub: 'Vis lommebok XPUB',
    },
    export: {
      title: 'lommebok eksport',
    },
    xpub: {
      title: 'lommebok XPUB',
      copiedToClipboard: 'Kopiert til utklippstavlen.',
    },
    import: {
      title: 'importer',
      explanation:
        'Skriv her din mnemonic, private nøkkel, WIF, eller hva som helst annet. BlueWallet vil gjøre sitt beste for å gjette riktig format og importere lommeboken din',
      imported: 'importert',
      error: 'Kunne ikke importere. Vennligst vær sikker på at de oppgitte dataene er gyldige.',
      success: 'Suksess',
      do_import: 'Importer',
      scan_qr: 'eller skann QR-kode i stedet?',
    },
    scanQrWif: {
      go_back: 'Gå tilbake',
      cancel: 'Avbryt',
      decoding: 'Dekoder',
      input_password: 'Input passord',
      password_explain: 'Dette er BIP38 kryptert privat nøkkel',
      bad_password: 'Feil passord',
      wallet_already_exists: 'En slik lommebok eksisterer allerede',
      bad_wif: 'Dårlig WIF',
      imported_wif: 'Importert WIF',
      with_address: ' med adresse',
      imported_segwit: 'Importert SegWit',
      imported_legacy: 'Importert Legacy',
      imported_watchonly: 'Importert Watch-only',
    },
  },
  transactions: {
    list: {
      tabBarLabel: 'Transaksjoner',
      title: 'transaksjoner',
      description: 'En liste over inngående eller utgående transaksjoner fra lommebokene dine',
      conf: 'conf',
    },
    details: {
      title: 'Transaksjon',
      from: 'Input',
      to: 'Produksjon',
      copy: 'Kopiere',
      transaction_details: 'Transaksjonsdetaljer',
      show_in_block_explorer: 'Vis i blokkutforsker',
    },
  },
  send: {
    header: 'Sende',
    details: {
      title: 'opprett transaksjon',
      amount_field_is_not_valid: 'Beløp feltet er ikke gyldig',
      fee_field_is_not_valid: 'Avgiftsfeltet er ikke gyldig',
      address_field_is_not_valid: 'Adressefeltet er ikke gyldig',
      total_exceeds_balance: 'Sendingsbeløpet overstiger den tilgjengelige saldoen.',
      create_tx_error: 'Det oppsto en feil under opprettelse av transaksjonen. Vennligst vær sikker på at adressen er gyldig.',
      address: 'adresse',
      amount_placeholder: 'mengde å sende (i GRS)',
      fee_placeholder: 'pluss transaksjonsgebyr (i GRS)',
      note_placeholder: 'notat til meg selv',
      cancel: 'Avbryt',
      scan: 'Skanne',
      send: 'Sende',
      create: 'Lag',
      remaining_balance: 'Gjenværende balanse',
    },
    confirm: {
      header: 'Bekrefte',
      sendNow: 'Send nå',
    },
    success: {
      done: 'Ferdig',
    },
    create: {
      details: 'Detaljer',
      title: 'opprett transaksjon',
      error: 'Feil ved å opprette transaksjon. Ugyldig adresse eller send beløp?',
      go_back: 'Gå tilbake',
      this_is_hex: 'Dette er transaksjonsheks, signert og klar til å sendes til nettverket.',
      to: 'Til',
      amount: 'Beløp',
      fee: 'Avgift',
      tx_size: 'TX-størrelse',
      satoshi_per_byte: 'Satoshi per byte',
      memo: 'Memo',
      broadcast: 'Kringkaste',
      not_enough_fee: 'Ikke nok avgift. Øk avgiften',
    },
  },
  receive: {
    header: 'Motta',
    details: {
      title: 'Del denne adressen med betaleren',
      share: 'dele',
      copiedToClipboard: 'Kopiert til utklippstavlen.',
      label: 'Beskrivelse',
      create: 'Lag',
      setAmount: 'Motta med beløp',
    },
    scan_lnurl: 'Scan to receive',
  },
  buyBitcoin: {
    header: 'Kjøp Groestlcoin',
    tap_your_address: 'Trykk på adressen din for å kopiere den til utklippstavlen:',
    copied: 'Kopiert til utklippstavlen!',
  },
  settings: {
    header: 'innstillinger',
    plausible_deniability: 'Troverdig denibilitet ...',
    storage_not_encrypted: 'Lagring: ikke kryptert',
    storage_encrypted: 'Lagring: kryptert',
    password: 'Passord',
    password_explain: 'Opprett passordet du vil bruke til å dekryptere lagringen',
    retype_password: 'Skriv inn passordet på nytt',
    passwords_do_not_match: 'passordene er ikke like',
    encrypt_storage: 'Krypter lagring',
    lightning_settings: 'Lightning innstillinger',
    lightning_settings_explain:
      'For å koble til din egen LND-node, vennligst installer LndHub' +
      ' og legg URLen her i innstillinger. La feltet være tomt for å bruke BlueWallets LNDHub (lndhub.io). Lommebøker opprettet etter lagring av endringer, vil koble til den angitte LNDHub.',
    electrum_settings: 'Electrum Settings',
    electrum_settings_explain: 'Set to blank to use default',
    save: 'Lagre',
    about: 'Om',
    language: 'Språk',
    currency: 'Valuta',
    advanced_options: 'Advanced Options',
    enable_advanced_mode: 'Enable advanced mode',
  },
  plausibledeniability: {
    title: 'Troverdighet benektelse',
    help:
      'Under visse omstendigheter kan du bli tvunget til å avsløre en' +
      'passord. For å holde mynten din trygg, kan BlueWallet opprette en annen' +
      'kryptert lagring, med et annet passord. Under press,' +
      'Du kan oppgi dette passordet til en tredjepart. Hvis inntastet i' +
      'BlueWallet, det vil låse opp ny "falsk" lagring. Dette vil virke' +
      'troverdig overfor en tredje part, men vil i hemmelighet beholde ' +
      'hovedlageret trygt.',
    help2: 'Ny lagring vil være fullt funksjonell, og du kan lagre en mindre sum der' + ' , slik at det ser mer troverdig ut.',
    create_fake_storage: 'Lag falsk kryptert lagring',
    go_back: 'Gå tilbake',
    create_password: 'Lag et passord',
    create_password_explanation: 'Passord for falsk lagring må ikke matche passord for hovedlager',
    password_should_not_match: 'Passord for falsk lagring må ikke matche passord for hovedlager',
    retype_password: 'Skriv inn passordet på nytt',
    passwords_do_not_match: 'Passordene stemmer ikke overens, prøv igjen',
    success: 'Vellykket',
  },
  lnd: {
    title: 'administrere midler',
    choose_source_wallet: 'Velg en kilde lommebok',
    refill_lnd_balance: 'Refill Lightning lommebokbalanse',
    refill: 'Fylle på',
    withdraw: 'Ta ut',
    expired: 'Utløpt',
    placeholder: 'Faktura',
    sameWalletAsInvoiceError: 'Du kan ikke betale en faktura med samme lommebok som brukes til å lage den.',
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
