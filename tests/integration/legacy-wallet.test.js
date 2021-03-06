/* global describe, it, jasmine, afterAll, beforeAll */
import { LegacyWallet, SegwitP2SHWallet, SegwitBech32Wallet } from '../../class';
let assert = require('assert');
global.net = require('net'); // needed by Electrum client. For RN it is proviced in shim.js
global.tls = require('tls'); // needed by Electrum client. For RN it is proviced in shim.js
let BlueElectrum = require('../../BlueElectrum'); // so it connects ASAP

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

afterAll(async () => {
  // after all tests we close socket so the test suite can actually terminate
  BlueElectrum.forceDisconnect();
});

beforeAll(async () => {
  // awaiting for Electrum to be connected. For RN Electrum would naturally connect
  // while app starts up, but for tests we need to wait for it
  await BlueElectrum.waitTillConnected();
});

describe('LegacyWallet', function() {
  it('can serialize and unserialize correctly', () => {
    let a = new LegacyWallet();
    a.setLabel('my1');
    let key = JSON.stringify(a);

    let b = LegacyWallet.fromJson(key);
    assert.strictEqual(b.type, LegacyWallet.type);
    assert.strictEqual(key, JSON.stringify(b));
  });

  it('can validate addresses', () => {
    let w = new LegacyWallet();
    assert.ok(w.isAddressValid('FWp7bfoFEfczt1pVQrQddqVXBN9hPvUYqs'));
    assert.ok(!w.isAddressValid('12eQ9m4sgAwTSQoNXkRABKhCXCsjm2j'));
    assert.ok(w.isAddressValid('34xp4vRoCGJym3xR7yCVPFHoCNxv7bXcAo'));
    assert.ok(!w.isAddressValid('3BDsBDxDimYgNZzsqszNZobqQq3yeUo'));
    assert.ok(!w.isAddressValid('12345'));
    assert.ok(w.isAddressValid('grs1q44n355j5aatyz78kj5e2es7rdpq690yzlwxlqx'));
    assert.ok(w.isAddressValid('GRS1QLE4ZLJDMPT77DTC98WHYZ90MSAMWJJE8U6D6K5'));
  });

  it('can fetch balance', async () => {
    let w = new LegacyWallet();
    w._address = '3JEmL9KXWK3r6cmd2s4HDNWS61FSj4J3SD'; // hack internals
    assert.ok(w.weOwnAddress('3JEmL9KXWK3r6cmd2s4HDNWS61FSj4J3SD'));
    assert.ok(!w.weOwnAddress('aaa'));
    assert.ok(w.getBalance() === 0);
    assert.ok(w.getUnconfirmedBalance() === 0);
    assert.ok(w._lastBalanceFetch === 0);
    await w.fetchBalance();
    assert.ok(w.getBalance() === 496360);
    assert.ok(w.getUnconfirmedBalance() === 0);
    assert.ok(w._lastBalanceFetch > 0);
  });

  it('can fetch TXs', async () => {
    let w = new LegacyWallet();
    w._address = 'FZi9qkpK2KdxUQ1x6T1vbn8jjSgsZazgo8';
    await w.fetchTransactions();
    assert.strictEqual(w.getTransactions().length, 2);

    for (let tx of w.getTransactions()) {
      assert.ok(tx.hash);
      assert.ok(tx.value);
      assert.ok(tx.received);
      assert.ok(tx.confirmations > 1);
    }
  });

  it('can fetch TXs when addresses for vout are missing', async () => {
    // Transaction with missing address output https://www.blockchain.com/btc/tx/d45818ae11a584357f7b74da26012d2becf4ef064db015a45bdfcd9cb438929d
    let w = new LegacyWallet();
    w._address = 'FbThBimw1krwL3QWf6XEk2Xen6NigyzGBT';
    await w.fetchTransactions();

    assert.ok(w.getTransactions().length > 0);
    for (let tx of w.getTransactions()) {
      assert.ok(tx.hash);
      assert.ok(tx.value);
      assert.ok(tx.received);
      assert.ok(tx.confirmations > 1);
    }
  });

  it.each([
    ['addresses for vout missing', 'FbThBimw1krwL3QWf6XEk2Xen6NigyzGBT'],
    ['txdatas were coming back null from BlueElectrum because of high batchsize', '3JEmL9KXWK3r6cmd2s4HDNWS61FSj4J3SD'],
  ])(
    'can fetch TXs when %s',
    async (useCase, address) => {
      let w = new LegacyWallet();
      w._address = address;
      await w.fetchTransactions();

      assert.ok(w.getTransactions().length > 0);
      for (let tx of w.getTransactions()) {
        assert.ok(tx.hash);
        assert.ok(tx.value);
        assert.ok(tx.received);
        assert.ok(tx.confirmations > 1);
      }
    },
    240000,
  );

  it('can fetch UTXO', async () => {
    let w = new LegacyWallet();
    w._address = '39f9bbx46WGZoLU3CUxRXi8ibXMX9SpyKD';
    await w.fetchUtxo();
    assert.ok(w.utxo.length > 0, 'unexpected empty UTXO');
    assert.ok(w.getUtxo().length > 0, 'unexpected empty UTXO');

    assert.ok(w.getUtxo()[0]['value']);
    assert.ok(w.getUtxo()[0]['vout'] === 0, JSON.stringify(w.getUtxo()[0]));
    assert.ok(w.getUtxo()[0]['txid']);
    assert.ok(w.getUtxo()[0]['confirmations']);
  });
});

describe('SegwitP2SHWallet', function() {
  it('can generate segwit P2SH address from WIF', async () => {
    let l = new SegwitP2SHWallet();
    l.setSecret('Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHRsYUJ4');
    assert.ok(l.getAddress() === '34AgLJhwXrvmkZS1o5TrcdeevMt1ywshkh', 'expected ' + l.getAddress());
    assert.ok(l.getAddress() === (await l.getAddressAsync()));
    assert.ok(l.weOwnAddress('34AgLJhwXrvmkZS1o5TrcdeevMt1ywshkh'));
  });
});

describe('SegwitBech32Wallet', function() {
  it('can fetch balance', async () => {
    let w = new SegwitBech32Wallet();
    w._address = 'grs1qphjsj69a65q9uv6ehp65hr84zjtffvw9630pcx';
    assert.ok(w.weOwnAddress('grs1qphjsj69a65q9uv6ehp65hr84zjtffvw9630pcx'));
    await w.fetchBalance();
    assert.strictEqual(w.getBalance(), 0);
  });

  it('can fetch UTXO', async () => {
    let w = new SegwitBech32Wallet();
    w._address = 'grs1q44n355j5aatyz78kj5e2es7rdpq690yzlwxlqx';
    await w.fetchUtxo();
    const l1 = w.getUtxo().length;
    assert.ok(w.getUtxo().length > 0, 'unexpected empty UTXO');

    assert.ok(w.getUtxo()[0]['value']);
    assert.ok(w.getUtxo()[0]['vout'] === 0);
    assert.ok(w.getUtxo()[0]['txid']);
    assert.ok(w.getUtxo()[0]['confirmations'], JSON.stringify(w.getUtxo()[0], null, 2));
    // double fetch shouldnt duplicate UTXOs:
    await w.fetchUtxo();
    const l2 = w.getUtxo().length;
    assert.strictEqual(l1, l2);
  });

  it('can fetch TXs', async () => {
    let w = new LegacyWallet();
    w._address = 'grs1qvsf5qwd5xpgftfndc7yncr9ydjer47cvxacd9y';
    await w.fetchTransactions();
    assert.strictEqual(w.getTransactions().length, 2);

    for (let tx of w.getTransactions()) {
      assert.ok(tx.hash);
      assert.ok(tx.value);
      assert.ok(tx.received);
      assert.ok(tx.confirmations > 1);
    }

    assert.strictEqual(w.getTransactions()[0].value, -178650);
    assert.strictEqual(w.getTransactions()[1].value, 178650);
  });

  it('can fetch TXs', async () => {
    let w = new LegacyWallet();
    w._address = 'grs1qksxm6s3v7k4x28rsth6ptdteghckqc7jd57gjj';
    assert.ok(w.weOwnAddress('grs1qksxm6s3v7k4x28rsth6ptdteghckqc7jd57gjj'));
    await w.fetchTransactions();
    assert.strictEqual(w.getTransactions().length, 1);

    for (let tx of w.getTransactions()) {
      assert.ok(tx.hash);
      assert.strictEqual(tx.value, 496220);
      assert.ok(tx.received);
      assert.ok(tx.confirmations > 1);
    }

    let tx0 = w.getTransactions()[0];
    assert.ok(tx0['inputs']);
    assert.ok(tx0['inputs'].length === 1);
    assert.ok(tx0['outputs']);
    assert.ok(tx0['outputs'].length === 1);
  });
});
