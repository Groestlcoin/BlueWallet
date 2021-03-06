import { AppStorage, LightningCustodianWallet } from './';
import AsyncStorage from '@react-native-community/async-storage';
import BitcoinBIP70TransactionDecode from '../bip70/bip70';
import RNFS from 'react-native-fs';
import url from 'url';
import { Chain } from '../models/bitcoinUnits';
const bitcoin = require('groestlcoinjs-lib');
const bip21 = require('bip21grs');
const BlueApp: AppStorage = require('../BlueApp');

class DeeplinkSchemaMatch {
  static hasSchema(schemaString) {
    if (typeof schemaString !== 'string' || schemaString.length <= 0) return false;
    const lowercaseString = schemaString.trim().toLowerCase();
    return (
      lowercaseString.startsWith('groestlcoin:') ||
      lowercaseString.startsWith('lightning:') ||
      lowercaseString.startsWith('blue:') ||
      lowercaseString.startsWith('bluewallet:') ||
      lowercaseString.startsWith('lapp:')
    );
  }

  /**
   * Examines the content of the event parameter.
   * If the content is recognizable, create a dictionary with the respective
   * navigation dictionary required by react-navigation
   *
   * @param event {{url: string}} URL deeplink as passed to app, e.g. `groestlcoin:grs1qle4zljdmpt77dtc98whyz90msamwjje8u6d6k5?amount=666&label=Yo`
   * @param completionHandler {function} Returns {routeName: string, params: object}
   */
  static navigationRouteFor(event, completionHandler) {
    if (event.url === null) {
      return;
    }
    if (typeof event.url !== 'string') {
      return;
    }

    if (event.url.toLowerCase().startsWith('bluewallet:groestlcoin:') || event.url.toLowerCase().startsWith('bluewallet:lightning:')) {
      event.url = event.url.substring(11);
    }

    if (DeeplinkSchemaMatch.isPossiblyPSBTFile(event.url)) {
      RNFS.readFile(event.url)
        .then(file => {
          if (file) {
            completionHandler({
              routeName: 'PsbtWithHardwareWallet',
              params: {
                deepLinkPSBT: file,
              },
            });
          }
        })
        .catch(e => console.warn(e));
      return;
    }
    let isBothBitcoinAndLightning;
    try {
      isBothBitcoinAndLightning = DeeplinkSchemaMatch.isBothBitcoinAndLightning(event.url);
    } catch (e) {
      console.log(e);
    }
    if (isBothBitcoinAndLightning) {
      completionHandler({
        routeName: 'HandleOffchainAndOnChain',
        params: {
          onWalletSelect: wallet =>
            completionHandler(DeeplinkSchemaMatch.isBothBitcoinAndLightningOnWalletSelect(wallet, isBothBitcoinAndLightning)),
        },
      });
    } else if (DeeplinkSchemaMatch.isBitcoinAddress(event.url) || BitcoinBIP70TransactionDecode.matchesPaymentURL(event.url)) {
      completionHandler({
        routeName: 'SendDetails',
        params: {
          uri: event.url,
        },
      });
    } else if (DeeplinkSchemaMatch.isLightningInvoice(event.url)) {
      completionHandler({
        routeName: 'ScanLndInvoice',
        params: {
          uri: event.url,
        },
      });
    } else if (DeeplinkSchemaMatch.isLnUrl(event.url)) {
      completionHandler({
        routeName: 'LNDCreateInvoice',
        params: {
          uri: event.url,
        },
      });
    } else if (DeeplinkSchemaMatch.isSafelloRedirect(event)) {
      let urlObject = url.parse(event.url, true) // eslint-disable-line

      const safelloStateToken = urlObject.query['safello-state-token'];

      completionHandler({
        routeName: 'BuyBitcoin',
        params: {
          uri: event.url,
          safelloStateToken,
        },
      });
    } else {
      let urlObject = url.parse(event.url, true); // eslint-disable-line
      console.log('parsed', urlObject);
      (async () => {
        if (urlObject.protocol === 'bluewallet:' || urlObject.protocol === 'lapp:' || urlObject.protocol === 'blue:') {
          switch (urlObject.host) {
            case 'openlappbrowser':
              console.log('opening LAPP', urlObject.query.url);
              // searching for LN wallet:
              let haveLnWallet = false;
              for (let w of BlueApp.getWallets()) {
                if (w.type === LightningCustodianWallet.type) {
                  haveLnWallet = true;
                }
              }

              if (!haveLnWallet) {
                // need to create one
                let w = new LightningCustodianWallet();
                w.setLabel(w.typeReadable);

                try {
                  let lndhub = await AsyncStorage.getItem(AppStorage.LNDHUB);
                  if (lndhub) {
                    w.setBaseURI(lndhub);
                    w.init();
                  }
                  await w.createAccount();
                  await w.authorize();
                } catch (Err) {
                  // giving up, not doing anything
                  return;
                }
                BlueApp.wallets.push(w);
                await BlueApp.saveToDisk();
              }

              // now, opening lapp browser and navigating it to URL.
              // looking for a LN wallet:
              let lnWallet;
              for (let w of BlueApp.getWallets()) {
                if (w.type === LightningCustodianWallet.type) {
                  lnWallet = w;
                  break;
                }
              }

              if (!lnWallet) {
                // something went wrong
                return;
              }

              completionHandler({
                routeName: 'LappBrowser',
                params: {
                  fromSecret: lnWallet.getSecret(),
                  fromWallet: lnWallet,
                  url: urlObject.query.url,
                },
              });
              break;
          }
        }
      })();
    }
  }

  static isTXNFile(filePath) {
    return filePath.toLowerCase().startsWith('file:') && filePath.toLowerCase().endsWith('.txn');
  }

  static isPossiblyPSBTFile(filePath) {
    return filePath.toLowerCase().startsWith('file:') && filePath.toLowerCase().endsWith('-signed.psbt');
  }

  static isBothBitcoinAndLightningOnWalletSelect(wallet, uri) {
    if (wallet.chain === Chain.ONCHAIN) {
      return {
        routeName: 'SendDetails',
        params: {
          uri: uri.bitcoin,
          fromWallet: wallet,
        },
      };
    } else if (wallet.chain === Chain.OFFCHAIN) {
      return {
        routeName: 'ScanLndInvoice',
        params: {
          uri: uri.lndInvoice,
          fromSecret: wallet.getSecret(),
        },
      };
    }
  }

  static isBitcoinAddress(address) {
    address = address
      .replace('groestlcoin:', '')
      .replace('GROESTLCOIN:', '')
      .replace('groestlcoin=', '')
      .split('?')[0];
    let isValidBitcoinAddress = false;
    try {
      bitcoin.address.toOutputScript(address);
      isValidBitcoinAddress = true;
    } catch (err) {
      isValidBitcoinAddress = false;
    }
    return isValidBitcoinAddress;
  }

  static isLightningInvoice(invoice) {
    let isValidLightningInvoice = false;
    if (invoice.toLowerCase().startsWith('lightning:lng') || invoice.toLowerCase().startsWith('lng')) {
      isValidLightningInvoice = true;
    }
    return isValidLightningInvoice;
  }

  static isLnUrl(text) {
    if (text.toLowerCase().startsWith('lightning:lnurl') || text.toLowerCase().startsWith('lnurl')) {
      return true;
    }
    return false;
  }

  static isSafelloRedirect(event) {
    let urlObject = url.parse(event.url, true) // eslint-disable-line

    return !!urlObject.query['safello-state-token'];
  }

  static isBothBitcoinAndLightning(url) {
    if (url.includes('lightning') && (url.includes('groestlcoin') || url.includes('GROESTLCOIN'))) {
      const txInfo = url.split(/(groestlcoin:|GROESTLCOIN:|lightning:|lightning=|groestlcoin=)+/);
      let bitcoin;
      let lndInvoice;
      for (const [index, value] of txInfo.entries()) {
        try {
          // Inside try-catch. We dont wan't to  crash in case of an out-of-bounds error.
          if (value.startsWith('groestlcoin') || value.startsWith('GROESTLCOIN')) {
            bitcoin = `groestlcoin:${txInfo[index + 1]}`;
            if (!DeeplinkSchemaMatch.isBitcoinAddress(bitcoin)) {
              bitcoin = false;
              break;
            }
          } else if (value.startsWith('lightning')) {
            lndInvoice = `lightning:${txInfo[index + 1]}`;
            if (!this.isLightningInvoice(lndInvoice)) {
              lndInvoice = false;
              break;
            }
          }
        } catch (e) {
          console.log(e);
        }
        if (bitcoin && lndInvoice) break;
      }
      if (bitcoin && lndInvoice) {
        return { bitcoin, lndInvoice };
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  static bip21decode(uri) {
    return bip21.decode(uri.replace('GROESTLCOIN:', 'groestlcoin:'));
  }

  static bip21encode() {
    return bip21.encode.apply(bip21, arguments);
  }
}

export default DeeplinkSchemaMatch;
