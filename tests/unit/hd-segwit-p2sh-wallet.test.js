import assert from 'assert';

import { SegwitP2SHWallet, SegwitBech32Wallet, HDSegwitP2SHWallet, HDLegacyP2PKHWallet, LegacyWallet } from '../../class';

describe('P2SH Segwit HD (BIP49)', () => {
  it('can create a wallet', async () => {
    const mnemonic =
      'honey risk juice trip orient galaxy win situate shoot anchor bounce remind horse traffic exotic since escape mimic ramp skin judge owner topple erode';
    const hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    assert.strictEqual('395AFhKYJCYGGR7P4rwvgqBTTfQukiHrWy', hd._getExternalAddressByIndex(0));
    assert.strictEqual('37547yv9AQUsE9abAoJqqdFZw8C2zj9k8E', hd._getExternalAddressByIndex(1));
    assert.strictEqual('38DBbhHEBFWbwm9abjjUVdTV2zs4FDRcp5', hd._getInternalAddressByIndex(0));
    assert.ok(hd.getAllExternalAddresses().includes('395AFhKYJCYGGR7P4rwvgqBTTfQukiHrWy'));
    assert.ok(hd.getAllExternalAddresses().includes('37547yv9AQUsE9abAoJqqdFZw8C2zj9k8E'));
    assert.ok(!hd.getAllExternalAddresses().includes('38DBbhHEBFWbwm9abjjUVdTV2zs4FDRcp5')); // not internal
    assert.strictEqual(true, hd.validateMnemonic());

    assert.strictEqual(
      hd._getPubkeyByAddress(hd._getExternalAddressByIndex(0)).toString('hex'),
      '02c3beeba8bbf24bfa336e03749683b1208b4aea13290337b00262d5afbe5f15c7',
    );
    assert.strictEqual(
      hd._getPubkeyByAddress(hd._getInternalAddressByIndex(0)).toString('hex'),
      '03c3ff5233bc11fa0273b508d42a144e5e475a7e5f17473d211d40d035db9da483',
    );

    assert.strictEqual(hd._getDerivationPathByAddress(hd._getExternalAddressByIndex(0)), "m/49'/17'/0'/0/0"); // wrong, FIXME
    assert.strictEqual(hd._getDerivationPathByAddress(hd._getInternalAddressByIndex(0)), "m/49'/17'/0'/1/0"); // wrong, FIXME

    assert.strictEqual('KzoosK4MqjwBBNANduQn9PpL2Y4a9sxEJNyAiQPzNArQ7XrPcPN7', hd._getExternalWIFByIndex(0));
    assert.strictEqual(
      'ypub6XnFnMGmSrB2RyVTUQk7NDyZQ4Aq4KyevntuMmRsNnJMyYmWopWYGp7aE21wQ6mXrxYH4dRHFfiqC5Sv9HLro5A4VoLjswSmGNZju8AhhLQ',
      hd.getXpub(),
    );
  });

  it('can convert witness to address', () => {
    let address = SegwitP2SHWallet.witnessToAddress('035c618df829af694cb99e664ce1b34f80ad2c3b49bcd0d9c0b1836c66b2d25fd8');
    assert.strictEqual(address, '34ZVGb3gT8xMLT6fpqC6dNVqJtJmuXR3Tf');
    address = SegwitP2SHWallet.witnessToAddress();
    assert.strictEqual(address, false);
    address = SegwitP2SHWallet.witnessToAddress('trololo');
    assert.strictEqual(address, false);

    address = SegwitP2SHWallet.scriptPubKeyToAddress('a914e286d58e53f9247a4710e51232cce0686f16873c87');
    assert.strictEqual(address, '3NLnALo49CFEF4tCRhCvz45ySSfz2hjD7w');
    address = SegwitP2SHWallet.scriptPubKeyToAddress();
    assert.strictEqual(address, false);
    address = SegwitP2SHWallet.scriptPubKeyToAddress('trololo');
    assert.strictEqual(address, false);

    address = SegwitBech32Wallet.witnessToAddress('035c618df829af694cb99e664ce1b34f80ad2c3b49bcd0d9c0b1836c66b2d25fd8');
    assert.strictEqual(address, 'grs1quhnve8q4tk3unhmjts7ymxv8cd6w9xv8n4ky9d');
    address = SegwitBech32Wallet.witnessToAddress();
    assert.strictEqual(address, false);
    address = SegwitBech32Wallet.witnessToAddress('trololo');
    assert.strictEqual(address, false);

    address = SegwitBech32Wallet.scriptPubKeyToAddress('00144d757460da5fcaf84cc22f3847faaa1078e84f6a');
    assert.strictEqual(address, 'grs1qf46hgcx6tl90snxz9uuy0742zpuwsnm2r4vvwl');
    address = SegwitBech32Wallet.scriptPubKeyToAddress();
    assert.strictEqual(address, false);
    address = SegwitBech32Wallet.scriptPubKeyToAddress('trololo');
    assert.strictEqual(address, false);

    address = LegacyWallet.scriptPubKeyToAddress('76a914d0b77eb1502c81c4093da9aa6eccfdf560cdd6b288ac');
    assert.strictEqual(address, 'FpCJpFznxu1zTmWbXr3nbqvCSCiQ38hvNz');
    address = LegacyWallet.scriptPubKeyToAddress();
    assert.strictEqual(address, false);
    address = LegacyWallet.scriptPubKeyToAddress('trololo');
    assert.strictEqual(address, false);
  });

  it('Segwit HD (BIP49) can generate addressess only via ypub', function () {
    const ypub = 'ypub6X46SconPpL9QhXPnMGuPLB9jYai7nrHz7ki4zq3awHb462iPSG5eV19oBWv22RWt69npsi75XGcANsevtTWE8YFgqpygrGUPnEKp6vty5v';
    const hd = new HDSegwitP2SHWallet();
    hd._xpub = ypub;
    assert.strictEqual('3299Qf2x9BnzLaZu4HCLvm26RbBB3ZRf4u', hd._getExternalAddressByIndex(0));
    assert.strictEqual('37WFkjwMYBkJrpnSA92iHjtFcXneDcQFTW', hd._getExternalAddressByIndex(1));
    assert.strictEqual('34e4had5XuUMLhqSoHakxoU9Kg9teFWW3R', hd._getInternalAddressByIndex(0));
    assert.ok(hd.getAllExternalAddresses().includes('3299Qf2x9BnzLaZu4HCLvm26RbBB3ZRf4u'));
    assert.ok(hd.getAllExternalAddresses().includes('37WFkjwMYBkJrpnSA92iHjtFcXneDcQFTW'));
    assert.ok(!hd.getAllExternalAddresses().includes('34e4had5XuUMLhqSoHakxoU9Kg9teFWW3R')); // not internal
  });

  it('can generate Segwit HD (BIP49)', async () => {
    const hd = new HDSegwitP2SHWallet();
    const hashmap = {};
    for (let c = 0; c < 1000; c++) {
      await hd.generate();
      const secret = hd.getSecret();
      if (hashmap[secret]) {
        throw new Error('Duplicate secret generated!');
      }
      hashmap[secret] = 1;
      assert.ok(secret.split(' ').length === 12 || secret.split(' ').length === 24);
    }

    const hd2 = new HDSegwitP2SHWallet();
    hd2.setSecret(hd.getSecret());
    assert.ok(hd2.validateMnemonic());
  });

  it('can work with malformed mnemonic', () => {
    let mnemonic =
      'honey risk juice trip orient galaxy win situate shoot anchor bounce remind horse traffic exotic since escape mimic ramp skin judge owner topple erode';
    let hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    const seed1 = hd._getSeed().toString('hex');
    assert.ok(hd.validateMnemonic());

    mnemonic = 'hell';
    hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    assert.ok(!hd.validateMnemonic());

    // now, malformed mnemonic

    mnemonic =
      '    honey  risk   juice    trip     orient      galaxy win !situate ;; shoot   ;;;   anchor Bounce remind\nhorse \n traffic exotic since escape mimic ramp skin judge owner topple erode ';
    hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    const seed2 = hd._getSeed().toString('hex');
    assert.strictEqual(seed1, seed2);
    assert.ok(hd.validateMnemonic());
  });

  it('can generate addressess based on xpub', async function () {
    const xpub = 'xpub6D1UJDwSYnrC6811wgE7QztbeciyL7zZs8r9a1kurTXiYgQUk9LibZ6mq6BPGgewxQvNXKmg8g6eqmiHofVUyX3nED1iACybAETVpzdzTGG';
    const hd = new HDLegacyP2PKHWallet();
    hd._xpub = xpub;
    assert.strictEqual(hd._getExternalAddressByIndex(0), 'FYN8Svwh3NpWta7UDVmHADgX5i6gpHKBG4');
    assert.strictEqual(hd._getInternalAddressByIndex(0), 'FmqnRqTe1nd7V9Bnm1WNMQnHxgb2yTBFXT');
    assert.strictEqual(hd._getExternalAddressByIndex(1), 'FYgX5ujkspKchM8cgpgeiBMxjv7EMmsvio');
    assert.strictEqual(hd._getInternalAddressByIndex(1), 'Fpe3XJo1gj9jkXh4UxHPdoXNDMVvaHNiYt');
    assert.ok(hd.getAllExternalAddresses().includes('FYN8Svwh3NpWta7UDVmHADgX5i6gpHKBG4'));
    assert.ok(hd.getAllExternalAddresses().includes('FYgX5ujkspKchM8cgpgeiBMxjv7EMmsvio'));
    assert.ok(!hd.getAllExternalAddresses().includes('FmqnRqTe1nd7V9Bnm1WNMQnHxgb2yTBFXT')); // not internal
  });

  it('can consume user generated entropy', async () => {
    const hd = new HDSegwitP2SHWallet();
    const zeroes = [...Array(32)].map(() => 0);
    await hd.generateFromEntropy(Buffer.from(zeroes));
    assert.strictEqual(
      hd.getSecret(),
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art',
    );
  });

  it('can fullfill user generated entropy if less than 32 bytes provided', async () => {
    const hd = new HDSegwitP2SHWallet();
    const zeroes = [...Array(16)].map(() => 0);
    await hd.generateFromEntropy(Buffer.from(zeroes));
    const secret = hd.getSecret();
    assert.strictEqual(secret.startsWith('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon'), true);

    let secretWithoutChecksum = secret.split(' ');
    secretWithoutChecksum.pop();
    secretWithoutChecksum = secretWithoutChecksum.join(' ');
    assert.strictEqual(
      secretWithoutChecksum.endsWith('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon'),
      false,
    );

    assert.ok(secret.split(' ').length === 12 || secret.split(' ').length === 24);
  });

  it('can sign and verify messages', async () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    let signature;

    // external address
    signature = hd.signMessage('vires is numeris', hd._getExternalAddressByIndex(0));
    assert.strictEqual(signature, 'I3P8VGkplzhlVLpLrTphSMfRyn29T1+4LQrr//aDuTOyK1mEyAhUvhD0oOtF6QEjbIWlux8vdgduN7SO0oEugN8=');
    assert.strictEqual(hd.verifyMessage('vires is numeris', hd._getExternalAddressByIndex(0), signature), true);

    // internal address
    signature = hd.signMessage('vires is numeris', hd._getInternalAddressByIndex(0));
    assert.strictEqual(signature, 'I7EXnbCdcYk24OKW1tCBSPMzIF9sxYiM2CzY73qD+XA2VmgHZqDCaWiyCFrN535wCFLEOYJJobCGzAdESvjhZyg=');
    assert.strictEqual(hd.verifyMessage('vires is numeris', hd._getInternalAddressByIndex(0), signature), true);
  });

  it('can show fingerprint', async () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    assert.strictEqual(hd.getMasterFingerprintHex(), '73C5DA0A');
  });

  it('can use mnemonic with passphrase', () => {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const passphrase = 'super secret passphrase';
    const hd = new HDSegwitP2SHWallet();
    hd.setSecret(mnemonic);
    hd.setPassphrase(passphrase);

    assert.strictEqual(
      hd.getXpub(),
      'ypub6Xa3WiyXHriYt1fxZGWS8B1iduw92yxHCMWKSwJkW6w92FUCTJxwWQQHLXjRHBSsMLY6SvRu8ErqFEC3JmrkTHEm7KSUfbzhUhj7Yopo2JR',
    );

    assert.strictEqual(hd._getExternalAddressByIndex(0), '3BtnNenqpGTXwwjb5a1KgzzoKV4TjCuySm');
    assert.strictEqual(hd._getInternalAddressByIndex(0), '3EJctafkUBvcSHYhunQRa2iYUHjrMGLXBV');
    assert.strictEqual(hd._getExternalWIFByIndex(0), 'L489rJZvUMrFsNop9EyuG2XdEmyKNTbjC1DWkg9WGEc1ddK6jgDg');
  });

  it('can create with custom derivation path', async () => {
    const hd = new HDSegwitP2SHWallet();
    hd.setSecret('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
    hd.setDerivationPath("m/49'/0'/1'");

    assert.strictEqual(
      hd.getXpub(),
      'ypub6Ww3ibxVfGzLtJR4F9SRBicspAfvmvw54yern9Q6qZWFC9T6FYA34K57La5Sgs8pXuyvpDfEHX5KNZRiZRukUWaVPyL4NxA69sEAqdoV8ve',
    );

    assert.strictEqual(hd._getExternalAddressByIndex(0), '35eszW2wmZ4hn7hfG5LGqxw5xCPjZcEJPM');
    assert.strictEqual(hd._getInternalAddressByIndex(0), '35gZZo6xPJEPgcz1cj1mTQHRMiPP97NGRY');
    assert.strictEqual(hd._getExternalWIFByIndex(0), 'KxTxanpst8612uDETejiDfSfbC2paXJi7teZ1ZfW5RpNfXbXnszw');

    assert.strictEqual(hd._getDerivationPathByAddress(hd._getExternalAddressByIndex(0)), "m/49'/0'/1'/0/0");
    assert.strictEqual(hd._getDerivationPathByAddress(hd._getInternalAddressByIndex(0)), "m/49'/0'/1'/1/0");
  });
});
