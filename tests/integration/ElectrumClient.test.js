import assert from 'assert';
import * as bitcoin from 'groestlcoinjs-lib';
import ElectrumClient from 'electrum-client';
import { sha256 as _sha256 } from '@noble/hashes/sha256';

const net = require('net');
const tls = require('tls');

jest.setTimeout(150 * 1000);

const hardcodedPeers = [
  { host: 'electrum1.groestlcoin.org', ssl: '50002' },
  { host: 'electrum2.groestlcoin.org', ssl: '50002' },
  { host: 'electrum1.groestlcoin.org', tcp: '50001' },
  { host: 'electrum2.groestlcoin.org', tcp: '50001' },
];

function bitcoinjs_crypto_sha256(buffer /*: Buffer */) /*: Buffer */ {
  return Buffer.from(_sha256(Uint8Array.from(buffer)));
}

describe('ElectrumClient', () => {
  it('can connect and query', async () => {
    for (const peer of hardcodedPeers) {
      const mainClient = new ElectrumClient(net, tls, peer.ssl || peer.tcp, peer.host, peer.ssl ? 'tls' : 'tcp');

      try {
        await mainClient.connect();
        await mainClient.server_version('2.7.11', '1.4');
      } catch (e) {
        mainClient.reconnect = mainClient.keepAlive = () => {}; // dirty hack to make it stop reconnecting
        mainClient.close();
        throw new Error('bad connection: ' + JSON.stringify(peer) + ' ' + e.message);
      }

      let addr4elect = 'grs1q44n355j5aatyz78kj5e2es7rdpq690yzlwxlqx';
      let script = bitcoin.address.toOutputScript(addr4elect);
      let hash = bitcoinjs_crypto_sha256(script);
      let reversedHash = Buffer.from(hash.reverse());
      const start = +new Date();
      let balance = await mainClient.blockchainScripthash_getBalance(reversedHash.toString('hex'));
      const end = +new Date();
      end - start > 1000 && console.warn(peer.host, 'took', (end - start) / 1000, 'seconds to fetch balance');
      assert.ok(balance.confirmed === 5884000);

      addr4elect = '3JEmL9KXWK3r6cmd2s4HDNWS61FSj4J3SD';
      script = bitcoin.address.toOutputScript(addr4elect);
      hash = bitcoinjs_crypto_sha256(script);
      reversedHash = Buffer.from(hash.reverse());
      balance = await mainClient.blockchainScripthash_getBalance(reversedHash.toString('hex'));

      // let peers = await mainClient.serverPeers_subscribe();
      // console.log(peers);
      mainClient.close();
    }
  });
});
