import assert from 'assert';
import * as bitcoin from 'groestlcoinjs-lib';

import * as BlueElectrum from '../../blue_modules/BlueElectrum';
import { HDLegacyBreadwalletWallet } from '../../class';
import { AbstractHDElectrumWallet } from '../../class/wallets/abstract-hd-electrum-wallet';

jest.setTimeout(300 * 1000);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

afterAll(async () => {
  // after all tests we close socket so the test suite can actually terminate
  BlueElectrum.forceDisconnect();
  await sleep(20);
});

beforeAll(async () => {
  // awaiting for Electrum to be connected. For RN Electrum would naturally connect
  // while app starts up, but for tests we need to wait for it
  await BlueElectrum.connectMain();
});

it('Legacy HD Breadwallet can fetch utxo, balance, and create transaction', async () => {
  if (!process.env.HD_MNEMONIC_BREAD) {
    console.error('process.env.HD_MNEMONIC_BREAD not set, skipped');
    return;
  }
  const wallet = new HDLegacyBreadwalletWallet();
  wallet.setSecret(process.env.HD_MNEMONIC_BREAD);

  await wallet.fetchBalance();

  // m/0'/0/1 1K9ofAnenRn1aR9TMMTreiin9ddjKWbS7z x 0.0001
  // m/0'/0/2 grs1qh0vtrnjn7zs99j4n6xaadde95ctnnvegh9l2jn x 0.00032084
  // m/0'/1/0 1A9Sc4opR6c7Ui6NazECiGmsmnUPh2WeHJ x 0.00016378 GRS
  // m/0'/1/1 grs1qksn08tz44fvnnrpgrrexvs9526t6jg3xnj9tpc x 0.00012422
  // 0.0001 + 0.00016378 + 0.00012422 + 0.00032084 = 0.00070884
  assert.strictEqual(wallet.getBalance(), 70884);

  // try to create a tx
  await wallet.fetchUtxo();

  for (const utxo of wallet.getUtxo()) {
    assert.ok(utxo.txhex);
    assert.ok(typeof utxo.vout !== 'undefined');
    assert.ok(utxo.txid);
    assert.ok(utxo.confirmations);
    assert.ok(utxo.value);
  }

  const { tx } = wallet.createTransaction(
    wallet.getUtxo(),
    [{ address: 'grs1q47efz9aav8g4mnnz9r6ql4pf48phy3g509p7gx' }],
    1,
    'grs1qk9hvkxqsqmps6ex3qawr79rvtg8es4ecjfu5v0',
    AbstractHDElectrumWallet.defaultRBFSequence,
    false,
    0,
  );

  assert.ok(tx);
  const transaction = bitcoin.Transaction.fromHex(tx.toHex());
  assert.ok(transaction.ins.length === 4);
  assert.strictEqual(transaction.outs.length, 1);
});
