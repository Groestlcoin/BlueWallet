/* global it, describe */
import { HDSegwitBech32Wallet } from '../../class';
const assert = require('assert');

describe('Bech32 Segwit HD (BIP84)', () => {
  it('can create', async function () {
    const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const hd = new HDSegwitBech32Wallet();
    hd.setSecret(mnemonic);

    assert.strictEqual(true, hd.validateMnemonic());
    assert.strictEqual(
      'zpub6qdhcNVVLJ2t8kLzGLzeaiJv7EahaRBsXmu1yVPyXHvMdFmS4d7JSi5aS6mc1oz5k6DZN781Ffn3GAs3r2FJnCPSw5nti63s3c9EDg2u7MS',
      hd.getXpub(),
    );

    assert.strictEqual(hd._getExternalWIFByIndex(0), 'L4mSsRa7DVFMez7MxcL9cV5ZxeKdMJpJmqJtdcGDz9oJM6sQsNz2');
    assert.strictEqual(hd._getExternalWIFByIndex(1), 'KygxBG82bZ2SrkhaFMLRYPUMLiGmjBANxg7vDCBNVqFhmveTZKWr');
    assert.strictEqual(hd._getInternalWIFByIndex(0), 'L3UPrg3xRSrVm3iHEEVLsyuXK54XJSJ9yZBzyEtrB1HNzAwnarPr');
    assert.ok(hd._getInternalWIFByIndex(0) !== hd._getInternalWIFByIndex(1));

    assert.strictEqual(hd._getExternalAddressByIndex(0), 'grs1qrm2uggqj846nljryvmuga56vtwfey0dtnc4z55');
    assert.strictEqual(hd._getExternalAddressByIndex(1), 'grs1qy2vlj0w9kp408mg74trj9s08azhzschw5ayp2g');
    assert.strictEqual(hd._getInternalAddressByIndex(0), 'grs1q4v3e7r759yegjtcwrevg5spe5vfvwkhhwz2zca');
    assert.ok(hd._getInternalAddressByIndex(0) !== hd._getInternalAddressByIndex(1));

    assert.ok(hd.getAllExternalAddresses().includes('grs1qrm2uggqj846nljryvmuga56vtwfey0dtnc4z55'));
    assert.ok(hd.getAllExternalAddresses().includes('grs1qy2vlj0w9kp408mg74trj9s08azhzschw5ayp2g'));
    assert.ok(!hd.getAllExternalAddresses().includes('grs1q4v3e7r759yegjtcwrevg5spe5vfvwkhhwz2zca')); // not internal

    assert.ok(hd.addressIsChange('grs1q4v3e7r759yegjtcwrevg5spe5vfvwkhhwz2zca'));
    assert.ok(!hd.addressIsChange('grs1qrm2uggqj846nljryvmuga56vtwfey0dtnc4z55'));

    assert.strictEqual(
      hd._getPubkeyByAddress(hd._getExternalAddressByIndex(0)).toString('hex'),
      '02b61ee53e24da178693ef0e7bdf34a250094deb2ec9dbd80b080d7242e54df383',
    );
    assert.strictEqual(
      hd._getPubkeyByAddress(hd._getInternalAddressByIndex(0)).toString('hex'),
      '02af1f15ed1969b0de88bb7858b6f0e3a12440f80534e21ee2422c81d644728650',
    );

    assert.strictEqual(hd._getDerivationPathByAddress(hd._getExternalAddressByIndex(0)), "m/84'/17'/0'/0/0");
    assert.strictEqual(hd._getDerivationPathByAddress(hd._getExternalAddressByIndex(1)), "m/84'/17'/0'/0/1");
    assert.strictEqual(hd._getDerivationPathByAddress(hd._getInternalAddressByIndex(0)), "m/84'/17'/0'/1/0");
    assert.strictEqual(hd._getDerivationPathByAddress(hd._getInternalAddressByIndex(1)), "m/84'/17'/0'/1/1");
  });

  it('can generate addresses only via zpub', function () {
    const zpub = 'zpub6sCLTMQWa1WvTpvrWH1UFLJDeStRkS9R2nvv8aVmNKsSzQfDYw6P58x3ANyQSBDN9yZUL3Lpt17bTpFt4qBKUEEAeCUBd2ez4T5VGJnNy61';
    const hd = new HDSegwitBech32Wallet();
    hd._xpub = zpub;
    assert.strictEqual(hd._getExternalAddressByIndex(0), 'grs1qavkhf67upgdrswpn94fukltcs8ugancp6kqln9');
    assert.strictEqual(hd._getExternalAddressByIndex(1), 'grs1qf2zyhzxphsunp59duhfggk6mnnt2p3pddgj7ts');
    assert.strictEqual(hd._getInternalAddressByIndex(0), 'grs1qcqpmm4hhh2zt6ndl3secyx7p80mjlkeevp2nlr');
    assert.ok(hd._getInternalAddressByIndex(0) !== hd._getInternalAddressByIndex(1));

    assert.ok(hd.getAllExternalAddresses().includes('grs1qavkhf67upgdrswpn94fukltcs8ugancp6kqln9'));
    assert.ok(hd.getAllExternalAddresses().includes('grs1qf2zyhzxphsunp59duhfggk6mnnt2p3pddgj7ts'));
    assert.ok(!hd.getAllExternalAddresses().includes('grs1qcqpmm4hhh2zt6ndl3secyx7p80mjlkeevp2nlr')); // not internal
  });

  it('can generate', async () => {
    const hd = new HDSegwitBech32Wallet();
    const hashmap = {};
    for (let c = 0; c < 1000; c++) {
      await hd.generate();
      const secret = hd.getSecret();
      assert.strictEqual(secret.split(' ').length, 12);
      if (hashmap[secret]) {
        throw new Error('Duplicate secret generated!');
      }
      hashmap[secret] = 1;
      assert.ok(secret.split(' ').length === 12 || secret.split(' ').length === 24);
    }

    const hd2 = new HDSegwitBech32Wallet();
    hd2.setSecret(hd.getSecret());
    assert.ok(hd2.validateMnemonic());
  });

  it('can coin control', async () => {
    const hd = new HDSegwitBech32Wallet();

    // fake UTXO so we don't need to use fetchUtxo
    hd._utxo = [
      { txid: '11111', vout: 0, value: 11111 },
      { txid: '22222', vout: 0, value: 22222 },
    ];

    assert.ok(hd.getUtxo().length === 2);

    // freeze one UTXO and set a memo on it
    hd.setUTXOMetadata('11111', 0, { memo: 'somememo', frozen: true });
    assert.strictEqual(hd.getUTXOMetadata('11111', 0).memo, 'somememo');
    assert.strictEqual(hd.getUTXOMetadata('11111', 0).frozen, true);

    // now .getUtxo() should return a limited UTXO set
    assert.ok(hd.getUtxo().length === 1);
    assert.strictEqual(hd.getUtxo()[0].txid, '22222');

    // now .getUtxo(true) should return a full UTXO set
    assert.ok(hd.getUtxo(true).length === 2);

    // for UTXO with no metadata .getUTXOMetadata() should return an empty object
    assert.ok(Object.keys(hd.getUTXOMetadata('22222', 0)).length === 0);
  });
});
