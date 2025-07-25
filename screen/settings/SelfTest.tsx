import BIP32Factory from 'bip32grs';
import bip38 from 'bip38grs';
import * as bip39 from 'bip39';
import * as bitcoin from 'groestlcoinjs-lib';
import React, { Component } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
// @ts-ignore theres no type declaration for this
import BlueCrypto from 'react-native-blue-crypto';
import wif from 'wifgrs';

import * as BlueElectrum from '../../blue_modules/BlueElectrum';
import * as encryption from '../../blue_modules/encryption';
import * as fs from '../../blue_modules/fs';
import ecc from '../../blue_modules/noble_ecc';
import { BlueText } from '../../BlueComponents';
import {
  HDAezeedWallet,
  HDSegwitBech32Wallet,
  HDSegwitP2SHWallet,
  LegacyWallet,
  SegwitP2SHWallet,
  SLIP39LegacyP2PKHWallet,
  TaprootWallet,
} from '../../class';
import presentAlert from '../../components/Alert';
import Button from '../../components/Button';
import SaveFileButton from '../../components/SaveFileButton';
import loc from '../../loc';
import { CreateTransactionUtxo } from '../../class/wallets/types.ts';
import { BlueSpacing20 } from '../../components/BlueSpacing';
import { BlueLoading } from '../../components/BlueLoading.tsx';

const bip32 = BIP32Factory(ecc);

type TState = {
  isLoading?: boolean;
  isOk?: boolean;
  errorMessage?: string;
};

function assertStrictEqual<T>(actual: T, expected: T, message?: string) {
  if (expected !== actual) {
    throw new Error(message || 'Assertion failed that ' + JSON.stringify(expected) + ' equals ' + JSON.stringify(actual));
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
});

export default class SelfTest extends Component {
  state: TState;

  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  onPressImportDocument = async () => {
    try {
      fs.showFilePickerAndReadFile().then(file => {
        if (file && file.data && file.data.length > 0) {
          presentAlert({ message: file.data });
        } else {
          presentAlert({ message: 'Error reading file' });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    console.debug('SelfTest - componentDidMount');
    let errorMessage = '';
    let isOk = true;

    try {
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const uniqs: Record<string, 1> = {};
        const w = new SegwitP2SHWallet();
        for (let c = 0; c < 1000; c++) {
          await w.generate();
          if (uniqs[w.getSecret()]) {
            throw new Error('failed to generate unique private key');
          }
          uniqs[w.getSecret()] = 1;
        }
      } else {
        // skipping RN-specific test
      }

      //

      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        await BlueElectrum.ping();
        await BlueElectrum.waitTillConnected();
        const addr4elect = '3GCvDBAktgQQtsbN6x5DYiQCMmgZ9Yk8BK';
        const electrumBalance = await BlueElectrum.getBalanceByAddress(addr4elect);
        if (electrumBalance.confirmed !== 51432)
          throw new Error('BlueElectrum getBalanceByAddress failure, got ' + JSON.stringify(electrumBalance));

        const electrumTxs = await BlueElectrum.getTransactionsByAddress(addr4elect);
        if (electrumTxs.length !== 1) throw new Error('BlueElectrum getTransactionsByAddress failure, got ' + JSON.stringify(electrumTxs));
      } else {
        // skipping RN-specific test'
      }

      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const aezeed = new HDAezeedWallet();
        aezeed.setSecret(
          'abstract rhythm weird food attract treat mosquito sight royal actor surround ride strike remove guilt catch filter summer mushroom protect poverty cruel chaos pattern',
        );
        assertStrictEqual(await aezeed.validateMnemonicAsync(), true, 'Aezeed failed');
        assertStrictEqual(aezeed._getExternalAddressByIndex(0), 'bc1qdjj7lhj9lnjye7xq3dzv3r4z0cta294xy78txn', 'Aezeed failed');
      } else {
        // skipping RN-specific test
      }

      let l: LegacyWallet | SegwitP2SHWallet | TaprootWallet = new LegacyWallet();
      l.setSecret('L4ccWrPMmFDZw4kzAKFqJNxgHANjdy6b7YKNXMwB4xac4FLF3Tov');
      assertStrictEqual(l.getAddress(), '14YZ6iymQtBVQJk6gKnLCk49UScJK7SH4M');
      let utxos: CreateTransactionUtxo[] = [
        {
          txid: 'cc44e933a094296d9fe424ad7306f16916253a3d154d52e4f1a757c18242cec4',
          vout: 0,
          value: 100000,
          txhex:
            '0200000000010161890cd52770c150da4d7d190920f43b9f88e7660c565a5a5ad141abb6de09de00000000000000008002a0860100000000001976a91426e01119d265aa980390c49eece923976c218f1588ac3e17000000000000160014c1af8c9dd85e0e55a532a952282604f820746fcd02473044022072b3f28808943c6aa588dd7a4e8f29fad7357a2814e05d6c5d767eb6b307b4e6022067bc6a8df2dbee43c87b8ce9ddd9fe678e00e0f7ae6690d5cb81eca6170c47e8012102e8fba5643e15ab70ec79528833a2c51338c1114c4eebc348a235b1a3e13ab07100000000',
        },
      ];

      let txNew = l.createTransaction(
        utxos,
        [{ value: 90000, address: '1GX36PGBUrF8XahZEGQqHqnJGW2vCZteoB' }],
        1,
        String(l.getAddress()),
        0xffffffff,
        false,
        0,
      );
      const txBitcoin = bitcoin.Transaction.fromHex(txNew.tx!.toHex());
      assertStrictEqual(
        txNew.tx!.toHex(),
        '0200000001c4ce4282c157a7f1e4524d153d3a251669f10673ad24e49f6d2994a033e944cc000000006b48304502210091e58bd2021f2eeea8d39d7f7b053c9ccc52a747b60f1c3584ba33285e2d150602205b2d35a2536cbe157015e8c54a26f5fc350cc7c72b5ca80b9e548917993f652201210337c09b3cb889801638078fd4e6998218b28c92d338ea2602720a88847aedceb3ffffffff02905f0100000000001976a914aa381cd428a4e91327fd4434aa0a08ff131f1a5a88ac2e260000000000001976a91426e01119d265aa980390c49eece923976c218f1588ac00000000',
      );
      assertStrictEqual(txBitcoin.ins.length, 1);
      assertStrictEqual(txBitcoin.outs.length, 2);
      assertStrictEqual('1GX36PGBUrF8XahZEGQqHqnJGW2vCZteoB', bitcoin.address.fromOutputScript(txBitcoin.outs[0].script)); // to address
      assertStrictEqual(l.getAddress(), bitcoin.address.fromOutputScript(txBitcoin.outs[1].script)); // change address

      //

      l = new SegwitP2SHWallet();
      l.setSecret('Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct');
      if (l.getAddress() !== '34AgLJhwXrvmkZS1o5TrcdeevMt22Nar53') {
        throw new Error('failed to generate segwit P2SH address from WIF');
      }

      //

      const wallet = new SegwitP2SHWallet();
      wallet.setSecret('Ky1vhqYGCiCbPd8nmbUeGfwLdXB1h5aGwxHwpXrzYRfY5cTZPDo4');
      assertStrictEqual(wallet.getAddress(), '3CKN8HTCews4rYJYsyub5hjAVm5g5VFdQJ');

      utxos = [
        {
          txid: 'a56b44080cb606c0bd90e77fcd4fb34c863e68e5562e75b4386e611390eb860c',
          vout: 0,
          value: 300000,
        },
      ];

      txNew = wallet.createTransaction(
        utxos,
        [{ value: 90000, address: '1GX36PGBUrF8XahZEGQqHqnJGW2vCZteoB' }],
        1,
        String(wallet.getAddress()),
        0xffffffff,
        false,
        0,
      );
      const tx = bitcoin.Transaction.fromHex(txNew.tx!.toHex());
      assertStrictEqual(
        txNew.tx!.toHex(),
        '020000000001010c86eb9013616e38b4752e56e5683e864cb34fcd7fe790bdc006b60c08446ba50000000017160014139dc70d73097f9d775f8a3280ba3e3435515641ffffffff02905f0100000000001976a914aa381cd428a4e91327fd4434aa0a08ff131f1a5a88aca73303000000000017a914749118baa93fb4b88c28909c8bf0a8202a0484f4870248304502210080545d30e3d30dff272ab11c91fd6150170b603239b48c3d56a3fa66bf240085022003762404e1b45975adc89f61ec1569fa19d6d4a8d405e060897754c489ebeade012103a5de146762f84055db3202c1316cd9008f16047f4f408c1482fdb108217eda0800000000',
      );
      assertStrictEqual(tx.ins.length, 1);
      assertStrictEqual(tx.outs.length, 2);
      assertStrictEqual('1GX36PGBUrF8XahZEGQqHqnJGW2vCZteoB', bitcoin.address.fromOutputScript(tx.outs[0].script)); // to address
      assertStrictEqual(bitcoin.address.fromOutputScript(tx.outs[1].script), wallet.getAddress()); // change address

      //

      l = new TaprootWallet();
      l.setSecret('L4PKRVk1Peaar5WuH5LiKfkTygWtFfGrFeH2g2t3YVVqiwpJjMoF');
      if (l.getAddress() !== 'bc1payhxedzyjtu8w7ven7au9925pmhc5gl59m77ht9vqq0l5xq8fsgqtwg8vf') {
        throw new Error('failed to generate Taproot address from WIF');
      }

      //

      const txNewTaproot = l.createTransaction(
        [
          {
            value: 9778,
            address: 'bc1payhxedzyjtu8w7ven7au9925pmhc5gl59m77ht9vqq0l5xq8fsgqtwg8vf',
            txid: '511e007f9c96b6d713a72b730506198f61dd96046edee72f0dc636bfe1f3a9cf',
            vout: 0,
          },
        ],
        [{ address: '13HaCAB4jf7FYSZexJxoczyDDnutzZigjS' }],
        1,
        String(l.getAddress()),
        0xffffffff,
        false,
        0,
      );
      if (!txNewTaproot.tx) {
        throw new Error('failed to create Taproot tx');
      }

      //

      const data2encrypt = 'really long data string';
      const crypted = encryption.encrypt(data2encrypt, 'password');
      const decrypted = encryption.decrypt(crypted, 'password');

      if (decrypted !== data2encrypt) {
        throw new Error('encryption lib is not ok');
      }

      //
      const mnemonic =
        'honey risk juice trip orient galaxy win situate shoot anchor bounce remind horse traffic exotic since escape mimic ramp skin judge owner topple erode';
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const root = bip32.fromSeed(seed);

      const path = "m/49'/0'/0'/0/0";
      const child = root.derivePath(path);
      const address = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: child.publicKey,
          network: bitcoin.networks.bitcoin,
        }),
        network: bitcoin.networks.bitcoin,
      }).address;

      if (address !== '3GcKN7q7gZuZ8eHygAhHrvPa5zZbG5Q1rK') {
        throw new Error('bip49 is not ok');
      }

      //
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const hd = new HDSegwitP2SHWallet();
        const hashmap: Record<string, 1> = {};
        for (let c = 0; c < 1000; c++) {
          await hd.generate();
          const secret = hd.getSecret();
          if (hashmap[secret]) {
            throw new Error('Duplicate secret generated!');
          }
          hashmap[secret] = 1;
          if (secret.split(' ').length !== 12 && secret.split(' ').length !== 24) {
            throw new Error('mnemonic phrase not ok');
          }
        }

        const hd2 = new HDSegwitP2SHWallet();
        hd2.setSecret(hd.getSecret());
        if (!hd2.validateMnemonic()) {
          throw new Error('mnemonic phrase validation not ok');
        }

        //

        const hd4 = new HDSegwitBech32Wallet();
        hd4._xpub = 'zpub6r7jhKKm7BAVx3b3nSnuadY1WnshZYkhK8gKFoRLwK9rF3Mzv28BrGcCGA3ugGtawi1WLb2vyjQAX9ZTDGU5gNk2bLdTc3iEXr6tzR1ipNP';
        await hd4.fetchBalance();
        if (hd4.getBalance() !== 200000) throw new Error('Could not fetch HD Bech32 balance');
        await hd4.fetchTransactions();
        if (hd4.getTransactions().length !== 4) throw new Error('Could not fetch HD Bech32 transactions');
      } else {
        // skipping RN-specific test
      }

      // BlueCrypto test
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const hex = await BlueCrypto.scrypt('717765727479', '4749345a22b23cf3', 64, 8, 8, 32); // using non-default parameters to speed it up (not-bip38 compliant)
        if (hex.toUpperCase() !== 'F36AB2DC12377C788D61E6770126D8A01028C8F6D8FE01871CE0489A1F696A90')
          throw new Error('react-native-blue-crypto is not ok');
      }

      // bip38 test
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        let callbackWasCalled = false;
        const decryptedKey = await bip38.decryptAsync(
          '6PnU5voARjBBykwSddwCdcn6Eu9EcsK24Gs5zWxbJbPZYW7eiYQP8XgKbN',
          'qwerty',
          () => (callbackWasCalled = true),
        );
        assertStrictEqual(
          wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed),
          'KxqRtpd9vFju297ACPKHrGkgXuberTveZPXbRDiQ3MXZycSQYtjc',
          'bip38 failed',
        );
        // bip38 with BlueCrypto doesn't support progress callback
        assertStrictEqual(callbackWasCalled, false, "bip38 doesn't use BlueCrypto");
      }

      // slip39 test
      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        const w = new SLIP39LegacyP2PKHWallet();
        w.setSecret(
          'shadow pistol academic always adequate wildlife fancy gross oasis cylinder mustang wrist rescue view short owner flip making coding armed\n' +
            'shadow pistol academic acid actress prayer class unknown daughter sweater depict flip twice unkind craft early superior advocate guest smoking',
        );
        assertStrictEqual(w._getExternalAddressByIndex(0), '18pvMjy7AJbCDtv4TLYbGPbR7SzGzjqUpj', 'SLIP39 failed');
      }

      //

      if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        assertStrictEqual(await Linking.canOpenURL('https://github.com/BlueWallet/BlueWallet/'), true, 'Linking can not open https url');
      } else {
        // skipping RN-specific test'
      }

      //

      assertStrictEqual(Buffer.from('00ff0f', 'hex').reverse().toString('hex'), '0fff00');

      //
    } catch (Err) {
      console.log(Err);
      errorMessage += Err;
      isOk = false;
    }

    this.setState({
      isLoading: false,
      isOk,
      errorMessage,
    });
  }

  render() {
    return (
      <ScrollView automaticallyAdjustContentInsets contentInsetAdjustmentBehavior="automatic">
        <BlueSpacing20 />

        {this.state.isLoading ? (
          <BlueLoading testID="SelfTestLoading" />
        ) : (
          (() => {
            if (this.state.isOk) {
              return (
                <View style={styles.center}>
                  <BlueText testID="SelfTestOk" h4>
                    OK
                  </BlueText>
                  <BlueSpacing20 />
                  <BlueText>{loc.settings.about_selftest_ok}</BlueText>
                </View>
              );
            } else {
              return (
                <View style={styles.center}>
                  <BlueText h4 numberOfLines={0}>
                    {this.state.errorMessage}
                  </BlueText>
                </View>
              );
            }
          })()
        )}
        <BlueSpacing20 />
        <SaveFileButton fileName="bluewallet-selftest.txt" fileContent={'Success on ' + new Date().toUTCString()}>
          <Button title="Test Save to Storage" />
        </SaveFileButton>
        <BlueSpacing20 />
        <Button title="Test File Import" onPress={this.onPressImportDocument} />
      </ScrollView>
    );
  }
}
