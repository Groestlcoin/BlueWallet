import assert from 'assert';

import { HDLegacyElectrumSeedP2PKHWallet } from '../../class';

describe('HDLegacyElectrumSeedP2PKHWallet', () => {
  it('wont accept BIP39 seed', () => {
    const hd = new HDLegacyElectrumSeedP2PKHWallet();
    hd.setSecret(
      'honey risk juice trip orient galaxy win situate shoot anchor bounce remind horse traffic exotic since escape mimic ramp skin judge owner topple erode',
    );
    assert.ok(!hd.validateMnemonic());
  });

  it('wont accept electrum seed, but SEGWIT seed', () => {
    const hd = new HDLegacyElectrumSeedP2PKHWallet();
    hd.setSecret('method goddess  humble  crumble output snake essay carpet monster barely trip betray ');
    assert.ok(!hd.validateMnemonic());
  });

  it('can import mnemonics and generate addresses and WIFs', async function () {
    const hd = new HDLegacyElectrumSeedP2PKHWallet();
    hd.setSecret('receive happy wash prosper update pet neck acid try profit proud hungry  ');
    assert.ok(hd.validateMnemonic());
    assert.strictEqual(
      hd.getXpub(),
      'xpub661MyMwAqRbcG6vx5SspHUzrhRtPKyeGp41JJLBi3kgeMCFkR6mzGkhEttBHTZg6FYYij52pqD2cW7XsutiZrRukXNLqeo87mZAV5gUVvC6',
    );

    let address = hd._getExternalAddressByIndex(0);
    assert.strictEqual(address, 'FVNHbUEFFmJsAKNMEUSjU7MAFswVuBNHNH');
    assert.ok(hd.getAllExternalAddresses().includes('FVNHbUEFFmJsAKNMEUSjU7MAFswVuBNHNH'));

    address = hd._getInternalAddressByIndex(0);
    assert.strictEqual(address, 'Fo9PcqBmzeP7c9hYYVS6kCZrHD9wKxAuac');

    let wif = hd._getExternalWIFByIndex(0);
    assert.strictEqual(wif, 'KxGPz9dyib26p6bL2vQPvBPHBMA8iHVqEetg3x5XA4Rk1ttJFfHa');

    wif = hd._getInternalWIFByIndex(0);
    assert.strictEqual(wif, 'L52d26QmYGW8ctHo1omM5fZeJMgaonSkEWCGpnEekNvkVUpYDoZU');

    assert.strictEqual(
      hd._getPubkeyByAddress(hd._getExternalAddressByIndex(0)).toString('hex'),
      '02a6e6b674f82796cb4776673d824bf0673364fab24e62dcbfff4c1a5b69e3519b',
    );
    assert.strictEqual(
      hd._getPubkeyByAddress(hd._getInternalAddressByIndex(0)).toString('hex'),
      '0344708260d2a832fd430285a0b915859d73e6ed4c6c6a9cb73e9069a9de56fb23',
    );

    hd.setSecret('bs');
    assert.ok(!hd.validateMnemonic());
  });

  it('can use mnemonic with passphrase', () => {
    const mnemonic = 'receive happy  wash prosper update    pet neck acid try profit proud hungry  ';
    const passphrase = 'super secret passphrase';
    const hd = new HDLegacyElectrumSeedP2PKHWallet();
    hd.setSecret(mnemonic);
    hd.setPassphrase(passphrase);

    assert.strictEqual(
      hd.getXpub(),
      'xpub661MyMwAqRbcGSUBZaVtq8qEoRkJM1TZNNvUJEgQvtiZE73gS1wKWQoTj6R2E46UDYS2SBpmGGrSHGsJUNxtr1krixFuq8JA772pG43Mo6R',
    );

    assert.strictEqual(hd._getExternalAddressByIndex(0), '13sPvsrgRN8XibZNHtZXNqVDJPnNZLjTap');
    assert.strictEqual(hd._getInternalAddressByIndex(0), '16oEuy5H7ejmapqc2AtKAYerdfkDkoyrDX');
    assert.strictEqual(hd._getExternalWIFByIndex(0), 'Ky9WTDUTTZUKKYSPEE6uah2y5sJa89z6177kD23xh5cq1znX2HDj');
  });
});
