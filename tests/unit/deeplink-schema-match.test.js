import assert from 'assert';

import DeeplinkSchemaMatch from '../../class/deeplink-schema-match';
import { HDSegwitBech32Wallet } from '../../class/wallets/hd-segwit-bech32-wallet';
import { LightningCustodianWallet } from '../../class/wallets/lightning-custodian-wallet';
import { WatchOnlyWallet } from '../../class/wallets/watch-only-wallet';
import presentAlert from '../../components/Alert';
import loc from '../../loc';

jest.mock('../../components/Alert');
jest.mock('../../blue_modules/hapticFeedback');

jest.mock('../../blue_modules/BlueElectrum', () => {
  return {
    ensureConnected: jest.fn().mockResolvedValue(true),
  };
});

const onchainWallet = new HDSegwitBech32Wallet();
const lightningWallet = new LightningCustodianWallet();
const watchOnlyWallet = new WatchOnlyWallet();
watchOnlyWallet.setSecret(
  'zpub6rFDtF1nuXZ9PUL4XzKURh3vJBW6Kj6TUrYL4qPtFNtDXtcTVfiqjQDyrZNwjwzt5HS14qdqo3Co2282Lv3Re6Y5wFZxAVuMEpeygnnDwfx',
);

const contextFor = (wallets, preferredWalletID) => ({
  wallets,
  saveToDisk: () => {},
  addWallet: () => {},
  setSharedCosigner: () => {},
  preferredWalletID,
});

// helper function that promisifies function with a callback:
const asyncNavigationRouteFor = async function (event, context = contextFor([onchainWallet, lightningWallet])) {
  return new Promise(function (resolve) {
    DeeplinkSchemaMatch.navigationRouteFor(
      event,
      navValue => {
        resolve(navValue);
      },
      context,
    );
  });
};

describe.each(['', '//'])('unit - DeepLinkSchemaMatch', function (suffix) {
  it('hasSchema', () => {
    assert.ok(DeeplinkSchemaMatch.hasSchema('groestlcoin:${suffix}FWp7bfoFEfczt1pVQrQddqVXBN9hPvUYqs'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('groestlcoin:${suffix}grs1qle4zljdmpt77dtc98whyz90msamwjje8u6d6k5?amount=666&label=Yo'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('groestlcoin:${suffix}GRS1QLE4ZLJDMPT77DTC98WHYZ90MSAMWJJE8U6D6K5?amount=666&label=Yo'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo'));
    assert.ok(
      DeeplinkSchemaMatch.hasSchema(
        'lightning:${suffix}lngrs1m1p0t09zhpp5qsljqlwzp4k402uaeduful4l84xvk83jxtfun8yk33usq0u3mnfsdq5w3jhxapdwfjhzat9wd6qcqzpgxqy9gcqe25gnt4srxxtjfm65cj6eczsnn589m4szu4rtk0s5s2cmpwq5ax9dfrw67u0kqtlx4k283yqefd0x9lmnaxfsy8apqrj2esa36z99rgqf55pdm',
      ),
    );

    assert.ok(DeeplinkSchemaMatch.hasSchema('bluewallet:groestlcoin:${suffix}FWp7bfoFEfczt1pVQrQddqVXBN9hPvUYqs'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('bluewallet:groestlcoin:${suffix}grs1qle4zljdmpt77dtc98whyz90msamwjje8u6d6k5?amount=666&label=Yo'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('bluewallet:groestlcoin:${suffix}GRS1QLE4ZLJDMPT77DTC98WHYZ90MSAMWJJE8U6D6K5?amount=666&label=Yo'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('bluewallet:GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X'));
    assert.ok(DeeplinkSchemaMatch.hasSchema('bluewallet:GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo'));
    assert.ok(
      DeeplinkSchemaMatch.hasSchema(
        'bluewallet:lightning:${suffix}lngrs1m1p0t09zhpp5qsljqlwzp4k402uaeduful4l84xvk83jxtfun8yk33usq0u3mnfsdq5w3jhxapdwfjhzat9wd6qcqzpgxqy9gcqe25gnt4srxxtjfm65cj6eczsnn589m4szu4rtk0s5s2cmpwq5ax9dfrw67u0kqtlx4k283yqefd0x9lmnaxfsy8apqrj2esa36z99rgqf55pdm',
      ),
    );
  });

  it('isBitcoin Address', () => {
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('FWp7bfoFEfczt1pVQrQddqVXBN9hPvUYqs'));
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('3GcKN7q7gZuZ8eHygAhHrvPa5zZbGXa9bR'));
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('grs1q84svmadhrnestspddqxnrmndnkhwmquul9hx7h'));
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('GRS1Q84SVMADHRNESTSPDDQXNRMNDNKHWMQUUL9HX7H'));
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('groestlcoin:${suffix}GRS1QLE4ZLJDMPT77DTC98WHYZ90MSAMWJJE8U6D6K5'));
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X'));
    assert.ok(DeeplinkSchemaMatch.isBitcoinAddress('GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo'));
  });

  it('isLighting Invoice', () => {
    assert.ok(
      DeeplinkSchemaMatch.isLightningInvoice(
        'lightning:${suffix}lngrs1m1p0t09zhpp5qsljqlwzp4k402uaeduful4l84xvk83jxtfun8yk33usq0u3mnfsdq5w3jhxapdwfjhzat9wd6qcqzpgxqy9gcqe25gnt4srxxtjfm65cj6eczsnn589m4szu4rtk0s5s2cmpwq5ax9dfrw67u0kqtlx4k283yqefd0x9lmnaxfsy8apqrj2esa36z99rgqf55pdm',
      ),
    );
  });

  it('isBoth Bitcoin & Invoice', () => {
    assert.ok(
      DeeplinkSchemaMatch.isBothBitcoinAndLightning(
        'groestlcoin:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=0.000001&lightning=lngrs1m1p0t0944pp5f3n98pepjguxt8zelg52fzmcpyg02nr76dun074zallphe8stlysdqlw3jhxapdwfjhzat9wd6z6v3jxgeryvscqzpgxqy9gcqay452jdu5e6wq0wnzexk8zwu0ctw643me7vwvyg3htc4uyzp82jqha0v3ycss56j8jgmzpkfurgkwstxw30lu2luwmhq2vvxy08ay3gqgwatj0',
      ),
    );
    assert.ok(
      DeeplinkSchemaMatch.isBothBitcoinAndLightning(
        'GROESTLCOIN:${suffix}FcBN63fFz8riqokAUszsTgVJrngFdndrNQ?amount=0.000001&lightning=lngrs1m1p0t0944pp5f3n98pepjguxt8zelg52fzmcpyg02nr76dun074zallphe8stlysdqlw3jhxapdwfjhzat9wd6z6v3jxgeryvscqzpgxqy9gcqay452jdu5e6wq0wnzexk8zwu0ctw643me7vwvyg3htc4uyzp82jqha0v3ycss56j8jgmzpkfurgkwstxw30lu2luwmhq2vvxy08ay3gqgwatj0',
      ),
    );

    const rez = DeeplinkSchemaMatch.isBothBitcoinAndLightning(
      `groestlcoin:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=0.000001&lightning=lngrs1m1p0t0944pp5f3n98pepjguxt8zelg52fzmcpyg02nr76dun074zallphe8stlysdqlw3jhxapdwfjhzat9wd6z6v3jxgeryvscqzpgxqy9gcqay452jdu5e6wq0wnzexk8zwu0ctw643me7vwvyg3htc4uyzp82jqha0v3ycss56j8jgmzpkfurgkwstxw30lu2luwmhq2vvxy08ay3gqgwatj0`,
    );
    assert.strictEqual(rez.bitcoin, 'groestlcoin:GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=0.000001&');
    assert.strictEqual(
      rez.lndInvoice,
      'lightning:lngrs1m1p0t0944pp5f3n98pepjguxt8zelg52fzmcpyg02nr76dun074zallphe8stlysdqlw3jhxapdwfjhzat9wd6z6v3jxgeryvscqzpgxqy9gcqay452jdu5e6wq0wnzexk8zwu0ctw643me7vwvyg3htc4uyzp82jqha0v3ycss56j8jgmzpkfurgkwstxw30lu2luwmhq2vvxy08ay3gqgwatj0',
    );

    const rez2 = DeeplinkSchemaMatch.isBothBitcoinAndLightning(
      `groestlcoin:${suffix}bc1q8flg3jcnv6x6mpjrqty8h8h9mg0shgp5jc9smk?lightning=LNBC1P3WKFY3DQQPP5030V53XSDHSGJKZELYLE7EKTMEM38974498VNQDT2JAZ24TRW39QSP502JQJ4K6NR7AXQYMHKF3AX70JXFX6JZA4JYGVC66NJZHFS4TSA2Q9QRSGQCQPCXQY8AYQRZJQV06K0M23T593PNGL0JT7N9WZNP64FQNGVCTZ7VTS8NQ4TUKVTLJQZ2ZHYQQXQGQQSQQQQQQQQQQQQQQ9GRZJQTSJY9P55GDCEEVP36FVDMRKXQVZFHY8AK2TGC5ZGTJTRA9XLAZ97ZKCYVQQPRSQQVQQQQQQQQQQQQQQ9GY3X4N6RV6RCN53LDEV96AURLS3C66KPX74WA4UWCWU92JGKTPQE8NCQPZJ8JG6SUNYGZM320CDUTNVGSRC6XV286EVHRXEFSXXUZ0SSQWTM6DQ&amount=0`,
    );
    assert.strictEqual(rez2.bitcoin, 'groestlcoin:bc1q8flg3jcnv6x6mpjrqty8h8h9mg0shgp5jc9smk?');
    assert.strictEqual(
      rez2.lndInvoice,
      'lightning:LNBC1P3WKFY3DQQPP5030V53XSDHSGJKZELYLE7EKTMEM38974498VNQDT2JAZ24TRW39QSP502JQJ4K6NR7AXQYMHKF3AX70JXFX6JZA4JYGVC66NJZHFS4TSA2Q9QRSGQCQPCXQY8AYQRZJQV06K0M23T593PNGL0JT7N9WZNP64FQNGVCTZ7VTS8NQ4TUKVTLJQZ2ZHYQQXQGQQSQQQQQQQQQQQQQQ9GRZJQTSJY9P55GDCEEVP36FVDMRKXQVZFHY8AK2TGC5ZGTJTRA9XLAZ97ZKCYVQQPRSQQVQQQQQQQQQQQQQQ9GY3X4N6RV6RCN53LDEV96AURLS3C66KPX74WA4UWCWU92JGKTPQE8NCQPZJ8JG6SUNYGZM320CDUTNVGSRC6XV286EVHRXEFSXXUZ0SSQWTM6DQ',
    );

    const rez3 = DeeplinkSchemaMatch.isBothBitcoinAndLightning(
      `groestlcoin:bc1q8flg3jcnv6x6mpjrqty8h8h9mg0shgp5jc9smk?lightning=lnbc1p3wkfy3dqqpp5030v53xsdhsgjkzelyle7ektmem38974498vnqdt2jaz24trw39qsp502jqj4k6nr7axqymhkf3ax70jxfx6jza4jygvc66njzhfs4tsa2q9qrsgqcqpcxqy8ayqrzjqv06k0m23t593pngl0jt7n9wznp64fqngvctz7vts8nq4tukvtljqz2zhyqqxqgqqsqqqqqqqqqqqqqq9grzjqtsjy9p55gdceevp36fvdmrkxqvzfhy8ak2tgc5zgtjtra9xlaz97zkcyvqqprsqqvqqqqqqqqqqqqqq9gy3x4n6rv6rcn53ldev96aurls3c66kpx74wa4uwcwu92jgktpqe8ncqpzj8jg6sunygzm320cdutnvgsrc6xv286evhrxefsxxuz0ssqwtm6dq&amount=0`,
    );
    assert.strictEqual(rez3.bitcoin, 'groestlcoin:bc1q8flg3jcnv6x6mpjrqty8h8h9mg0shgp5jc9smk?');
    assert.strictEqual(
      rez3.lndInvoice,
      'lightning:lnbc1p3wkfy3dqqpp5030v53xsdhsgjkzelyle7ektmem38974498vnqdt2jaz24trw39qsp502jqj4k6nr7axqymhkf3ax70jxfx6jza4jygvc66njzhfs4tsa2q9qrsgqcqpcxqy8ayqrzjqv06k0m23t593pngl0jt7n9wznp64fqngvctz7vts8nq4tukvtljqz2zhyqqxqgqqsqqqqqqqqqqqqqq9grzjqtsjy9p55gdceevp36fvdmrkxqvzfhy8ak2tgc5zgtjtra9xlaz97zkcyvqqprsqqvqqqqqqqqqqqqqq9gy3x4n6rv6rcn53ldev96aurls3c66kpx74wa4uwcwu92jgktpqe8ncqpzj8jg6sunygzm320cdutnvgsrc6xv286evhrxefsxxuz0ssqwtm6dq',
    );

    // no amount
    const rez4 = DeeplinkSchemaMatch.isBothBitcoinAndLightning(
      `groestlcoin:bc1q8flg3jcnv6x6mpjrqty8h8h9mg0shgp5jc9smk?lightning=lnbc1p3wkfy3dqqpp5030v53xsdhsgjkzelyle7ektmem38974498vnqdt2jaz24trw39qsp502jqj4k6nr7axqymhkf3ax70jxfx6jza4jygvc66njzhfs4tsa2q9qrsgqcqpcxqy8ayqrzjqv06k0m23t593pngl0jt7n9wznp64fqngvctz7vts8nq4tukvtljqz2zhyqqxqgqqsqqqqqqqqqqqqqq9grzjqtsjy9p55gdceevp36fvdmrkxqvzfhy8ak2tgc5zgtjtra9xlaz97zkcyvqqprsqqvqqqqqqqqqqqqqq9gy3x4n6rv6rcn53ldev96aurls3c66kpx74wa4uwcwu92jgktpqe8ncqpzj8jg6sunygzm320cdutnvgsrc6xv286evhrxefsxxuz0ssqwtm6dq`,
    );
    assert.strictEqual(rez4.bitcoin, 'groestlcoin:bc1q8flg3jcnv6x6mpjrqty8h8h9mg0shgp5jc9smk?');
    assert.strictEqual(
      rez4.lndInvoice,
      'lightning:lnbc1p3wkfy3dqqpp5030v53xsdhsgjkzelyle7ektmem38974498vnqdt2jaz24trw39qsp502jqj4k6nr7axqymhkf3ax70jxfx6jza4jygvc66njzhfs4tsa2q9qrsgqcqpcxqy8ayqrzjqv06k0m23t593pngl0jt7n9wznp64fqngvctz7vts8nq4tukvtljqz2zhyqqxqgqqsqqqqqqqqqqqqqq9grzjqtsjy9p55gdceevp36fvdmrkxqvzfhy8ak2tgc5zgtjtra9xlaz97zkcyvqqprsqqvqqqqqqqqqqqqqq9gy3x4n6rv6rcn53ldev96aurls3c66kpx74wa4uwcwu92jgktpqe8ncqpzj8jg6sunygzm320cdutnvgsrc6xv286evhrxefsxxuz0ssqwtm6dq',
    );
  });

  it('isLnurl', () => {
    assert.ok(
      DeeplinkSchemaMatch.isLnUrl(
        'LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0M385EKVCENXC6R2C35XVUKXEFCV5MKVV34X5EKZD3EV56NYD3HXQURZEPEXEJXXEPNXSCRVWFNV9NXZCN9XQ6XYEFHVGCXXCMYXYMNSERXFQ5FNS',
      ),
    );
  });

  it('navigationForRoute', async () => {
    const events = [
      {
        argument: { url: `FWp7bfoFEfczt1pVQrQddqVXBN9hPvUYqs` },
        expected: [
          'SendDetailsRoot',
          {
            screen: 'SendDetails',
            merge: true,
            pop: true,
            params: { uri: 'FWp7bfoFEfczt1pVQrQddqVXBN9hPvUYqs', walletID: onchainWallet.getID() },
          },
        ],
      },
      {
        argument: {
          url: 'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
        },
        expected: [
          'SendDetailsRoot',
          {
            screen: 'SendDetails',
            merge: true,
            pop: true,
            params: {
              uri: 'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv',
              walletID: onchainWallet.getID(),
            },
          },
        ],
      },
      {
        argument: {
          url: 'PM8TJS2JxQ5ztXUpBBRnpTbcUXbUHy2T1abfrb3KkAAtMEGNbey4oumH7Hc578WgQJhPjBxteQ5GHHToTYHE3A1w6p7tU6KSoFmWBVbFGjKPisZDbP97',
        },
        expected: [
          'SendDetailsRoot',
          {
            screen: 'SendDetails',
            merge: true,
            pop: true,
            params: {
              uri: 'PM8TJS2JxQ5ztXUpBBRnpTbcUXbUHy2T1abfrb3KkAAtMEGNbey4oumH7Hc578WgQJhPjBxteQ5GHHToTYHE3A1w6p7tU6KSoFmWBVbFGjKPisZDbP97',
              walletID: onchainWallet.getID(),
            },
          },
        ],
      },
      {
        argument: { url: `groestlcoin:${suffix}12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG` },
        expected: [
          'SendDetailsRoot',
          {
            screen: 'SendDetails',
            merge: true,
            pop: true,
            params: { uri: 'groestlcoin:12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG', walletID: onchainWallet.getID() },
          },
        ],
      },
      {
        argument: { url: 'GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo' },
        expected: [
          'SendDetailsRoot',
          {
            screen: 'SendDetails',
            merge: true,
            pop: true,
            params: { uri: 'GROESTLCOIN:GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo', walletID: onchainWallet.getID() },
          },
        ],
      },
      {
        argument: { url: 'bluewallet:GROESTLCOIN:${suffix}GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo' },
        expected: [
          'SendDetailsRoot',
          {
            screen: 'SendDetails',
            merge: true,
            pop: true,
            params: { uri: 'GROESTLCOIN:GRS1Q44JTK2QL0XTGJPDWRYSZWC7W8TSW30HP6YCT3X?amount=666&label=Yo', walletID: onchainWallet.getID() },
          },
        ],
      },
      {
        argument: {
          url: 'lightning:${suffix}lngrs10u1pwjqwkkpp5vlc3tttdzhpk9fwzkkue0sf2pumtza7qyw9vucxyyeh0yaqq66yqdq5f38z6mmwd3ujqar9wd6qcqzpgxq97zvuqrzjqvgptfurj3528snx6e3dtwepafxw5fpzdymw9pj20jj09sunnqmwqz9hx5qqtmgqqqqqqqlgqqqqqqgqjq5duu3fs9xq9vn89qk3ezwpygecu4p3n69wm3tnl28rpgn2gmk5hjaznemw0gy32wrslpn3g24khcgnpua9q04fttm2y8pnhmhhc2gncplz0zde',
        },
        expected: [
          'ScanLNDInvoiceRoot',
          {
            screen: 'ScanLNDInvoice',
            params: {
              uri: 'lightning:lngrs10u1pwjqwkkpp5vlc3tttdzhpk9fwzkkue0sf2pumtza7qyw9vucxyyeh0yaqq66yqdq5f38z6mmwd3ujqar9wd6qcqzpgxq97zvuqrzjqvgptfurj3528snx6e3dtwepafxw5fpzdymw9pj20jj09sunnqmwqz9hx5qqtmgqqqqqqqlgqqqqqqgqjq5duu3fs9xq9vn89qk3ezwpygecu4p3n69wm3tnl28rpgn2gmk5hjaznemw0gy32wrslpn3g24khcgnpua9q04fttm2y8pnhmhhc2gncplz0zde',
              walletID: lightningWallet.getID(),
            },
          },
        ],
      },
      {
        argument: {
          url: 'bluewallet:lightning:${suffix}lngrs10u1pwjqwkkpp5vlc3tttdzhpk9fwzkkue0sf2pumtza7qyw9vucxyyeh0yaqq66yqdq5f38z6mmwd3ujqar9wd6qcqzpgxq97zvuqrzjqvgptfurj3528snx6e3dtwepafxw5fpzdymw9pj20jj09sunnqmwqz9hx5qqtmgqqqqqqqlgqqqqqqgqjq5duu3fs9xq9vn89qk3ezwpygecu4p3n69wm3tnl28rpgn2gmk5hjaznemw0gy32wrslpn3g24khcgnpua9q04fttm2y8pnhmhhc2gncplz0zde',
        },
        expected: [
          'ScanLNDInvoiceRoot',
          {
            screen: 'ScanLNDInvoice',
            params: {
              uri: 'lightning:lngrs10u1pwjqwkkpp5vlc3tttdzhpk9fwzkkue0sf2pumtza7qyw9vucxyyeh0yaqq66yqdq5f38z6mmwd3ujqar9wd6qcqzpgxq97zvuqrzjqvgptfurj3528snx6e3dtwepafxw5fpzdymw9pj20jj09sunnqmwqz9hx5qqtmgqqqqqqqlgqqqqqqgqjq5duu3fs9xq9vn89qk3ezwpygecu4p3n69wm3tnl28rpgn2gmk5hjaznemw0gy32wrslpn3g24khcgnpua9q04fttm2y8pnhmhhc2gncplz0zde',
              walletID: lightningWallet.getID(),
            },
          },
        ],
      },
      /*
      {
        argument: {
          url: 'https://azte.co/?c1=3062&c2=2586&c3=5053&c4=5261',
        },
        expected: [
          'AztecoRedeemRoot',
          {
            screen: 'AztecoRedeem',
            params: {
              aztecoVoucher: { c1: '3062', c2: '2586', c3: '5053', c4: '5261' },
            },
          },
        ],
      },
      {
        argument: {
          url: 'https://azte.co/redeem?code=1111222233334444',
        },
        expected: [
          'AztecoRedeemRoot',
          {
            screen: 'AztecoRedeem',
            params: {
              aztecoVoucher: { c1: '1111', c2: '2222', c3: '3333', c4: '4444' },
            },
          },
        ],
      },*/
      {
        argument: {
          url: 'bluewallet:setelectrumserver?server=electrum1.groestlcoin.org%3A443%3As',
        },
        expected: [
          'ElectrumSettings',
          {
            server: 'electrum1.groestlcoin.org:443:s',
          },
        ],
      },
      /*
      {
        argument: {
          url: 'bluewallet:setlndhuburl?url=https%3A%2F%2Flndhub.herokuapp.com',
        },
        expected: [
          'LightningSettings',
          {
            url: 'https://lndhub.herokuapp.com',
          },
        ],
      },
      {
        argument: {
          url: 'https://lnbits.com/?lightning=LNURL1DP68GURN8GHJ7MRWVF5HGUEWVDHK6TMHD96XSERJV9MJ7CTSDYHHVVF0D3H82UNV9UM9JDENFPN5SMMK2359J5RKWVMKZ5ZVWAV4VJD63TM',
        },
        expected: [
          'LNDCreateInvoiceRoot',
          {
            screen: 'LNDCreateInvoice',
            params: {
              uri: 'https://lnbits.com/?lightning=LNURL1DP68GURN8GHJ7MRWVF5HGUEWVDHK6TMHD96XSERJV9MJ7CTSDYHHVVF0D3H82UNV9UM9JDENFPN5SMMK2359J5RKWVMKZ5ZVWAV4VJD63TM',
              walletID: lightningWallet.getID(),
            },
          },
        ],
      },
      {
        argument: {
          url: 'lightning:LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NYVFEX93X2DFK8P3KVEFKVSEXZWR98PSNJVRRV5CRGCE3X4JKGE3HXPNXGCMPV5MXXVTZ89NXZENXXCURGCTRV93RVE35XQCXVCFSVSN8GCT884KX7EMFDCDKKXQ0',
        },
        expected: [
          'LnurlAuth',
          {
            lnurl:
              'LNURL1DP68GURN8GHJ7MRFVA58GMNFDENKCMM8D9HZUMRFWEJJ7MR0VA5KU0MTXY7NYVFEX93X2DFK8P3KVEFKVSEXZWR98PSNJVRRV5CRGCE3X4JKGE3HXPNXGCMPV5MXXVTZ89NXZENXXCURGCTRV93RVE35XQCXVCFSVSN8GCT884KX7EMFDCDKKXQ0',
          },
        ],
      },
      {
        argument: {
          url: 'lnaddress@zbd.gg',
        },
        expected: [
          'ScanLNDInvoiceRoot',
          {
            screen: 'ScanLNDInvoice',
            params: {
              uri: 'lnaddress@zbd.gg',
              walletID: lightningWallet.getID(),
            },
          },
        ],
      },
      */
      {
        argument: {
          url: require('fs').readFileSync('./tests/unit/fixtures/skeleton-cobo.txt', 'ascii'),
        },
        expected: [
          'AddWalletRoot',
          {
            screen: 'ImportWallet',
            params: {
              triggerImport: true,
              label: require('fs').readFileSync('./tests/unit/fixtures/skeleton-cobo.txt', 'ascii'),
            },
          },
        ],
      },
      {
        argument: {
          url: require('fs').readFileSync('./tests/unit/fixtures/skeleton-coldcard.txt', 'ascii'),
        },
        expected: [
          'AddWalletRoot',
          {
            screen: 'ImportWallet',
            params: {
              triggerImport: true,
              label: require('fs').readFileSync('./tests/unit/fixtures/skeleton-coldcard.txt', 'ascii'),
            },
          },
        ],
      },
      {
        argument: {
          url: require('fs').readFileSync('./tests/unit/fixtures/skeleton-electrum.txt', 'ascii'),
        },
        expected: [
          'AddWalletRoot',
          {
            screen: 'ImportWallet',
            params: {
              triggerImport: true,
              label: require('fs').readFileSync('./tests/unit/fixtures/skeleton-electrum.txt', 'ascii'),
            },
          },
        ],
      },
      {
        argument: {
          url: require('fs').readFileSync('./tests/unit/fixtures/skeleton-walletdescriptor.txt', 'ascii'),
        },
        expected: [
          'AddWalletRoot',
          {
            screen: 'ImportWallet',
            params: {
              triggerImport: true,
              label: require('fs').readFileSync('./tests/unit/fixtures/skeleton-walletdescriptor.txt', 'ascii'),
            },
          },
        ],
      },
      {
        argument: {
          url: 'zpub6rFDtF1nuXZ9PUL4XzKURh3vJBW6Kj6TUrYL4qPtFNtDXtcTVfiqjQDyrZNwjwzt5HS14qdqo3Co2282Lv3Re6Y5wFZxAVuMEpeygrJxNf7',
        },
        expected: [
          'AddWalletRoot',
          {
            screen: 'ImportWallet',
            params: {
              triggerImport: true,
              label: 'zpub6rFDtF1nuXZ9PUL4XzKURh3vJBW6Kj6TUrYL4qPtFNtDXtcTVfiqjQDyrZNwjwzt5HS14qdqo3Co2282Lv3Re6Y5wFZxAVuMEpeygrJxNf7',
            },
          },
        ],
      },
    ];

    for (const event of events) {
      const navValue = await asyncNavigationRouteFor(event.argument);
      assert.deepStrictEqual(navValue, event.expected);
    }

    // BIP21 w/BOLT11 support
    const rez = await asyncNavigationRouteFor({
      url: 'groestlcoin:${suffix}Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR?amount=0.000001&lightning=lngrs1u1pwry044pp53xlmkghmzjzm3cljl6729cwwqz5hhnhevwfajpkln850n7clft4sdqlgfy4qv33ypmj7sj0f32rzvfqw3jhxaqcqzysxq97zvuq5zy8ge6q70prnvgwtade0g2k5h2r76ws7j2926xdjj2pjaq6q3r4awsxtm6k5prqcul73p3atveljkn6wxdkrcy69t6k5edhtc6q7lgpe4m5k4',
    });
    assert.strictEqual(rez[0], 'SelectWallet');
    assert.ok(rez[1].onWalletSelect);
    assert.ok(typeof rez[1].onWalletSelect === 'function');
  });

  it('decodes bip21', () => {
    let decoded = DeeplinkSchemaMatch.bip21decode('groestlcoin:${suffix}Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR?amount=20.3&label=Foobar');
    assert.deepStrictEqual(decoded, {
      address: 'Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR',
      options: {
        amount: 20.3,
        label: 'Foobar',
      },
    });

    decoded = DeeplinkSchemaMatch.bip21decode(
      'groestlcoin:${suffix}grs1q6ve7qrz0gg9tt22022rx620uepkpkk2ed286gw?amount=0.0001&pj=https://grspay.com/GRS/pj',
    );
    assert.strictEqual(decoded.options.pj, 'https://grspay.com/GRS/pj');

    decoded = DeeplinkSchemaMatch.bip21decode('GROESTLCOIN:${suffix}Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR?amount=20.3&label=Foobar');
    assert.deepStrictEqual(decoded, {
      address: 'Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR',
      options: {
        amount: 20.3,
        label: 'Foobar',
      },
    });
  });

  it('encodes bip21', () => {
    let encoded = DeeplinkSchemaMatch.bip21encode('Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR');
    assert.strictEqual(encoded, 'groestlcoin:Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR');
    encoded = DeeplinkSchemaMatch.bip21encode('Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR', {
      amount: 20.3,
      label: 'Foobar',
    });
    assert.strictEqual(encoded, 'groestlcoin:Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR?amount=20.3&label=Foobar');
  });

  it('encodes bip21 and discards empty arguments', () => {
    const encoded = DeeplinkSchemaMatch.bip21encode('1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH', {
      label: ' ',
      amoount: undefined,
    });
    assert.strictEqual(encoded, 'groestlcoin:1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH');
  });

  it('can decodeBitcoinUri', () => {
    assert.deepStrictEqual(
      DeeplinkSchemaMatch.decodeBitcoinUri(
        'groestlcoin:${suffix}grs1q6ve7qrz0gg9tt22022rx620uepkpkk2ed286gw?amount=0.0001&pj=https://grspay.com/GRS/pj',
      ),
      {
        address: 'grs1q6ve7qrz0gg9tt22022rx620uepkpkk2ed286gw',
        amount: 0.0001,
        memo: '',
        payjoinUrl: 'https://grspay.com/GRS/pj',
        disableOutputSubstitution: false,
      },
    );

    // BIP78: pjos=0 means the sender MUST disallow payment output substitution
    assert.deepStrictEqual(
      DeeplinkSchemaMatch.decodeBitcoinUri(
        `groestlcoin:${suffix}grs1q6ve7qrz0gg9tt22022rx620uepkpkk2ed286gw?amount=0.0001&pj=https://grspay.com/GRS/pj&pjos=0`,
      ),
      {
        address: 'grs1q6ve7qrz0gg9tt22022rx620uepkpkk2ed286gw',
        amount: 0.0001,
        memo: '',
        payjoinUrl: 'https://grspay.com/GRS/pj',
        disableOutputSubstitution: true,
      },
    );

    assert.deepStrictEqual(
      DeeplinkSchemaMatch.decodeBitcoinUri(`GROESTLCOIN:${suffix}Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR?amount=20.3&label=Foobar`),
      {
        address: 'Ffqz14cyvZYJavD76t6oHNDJnGiWcZMVxR',
        amount: 20.3,
        memo: 'Foobar',
        payjoinUrl: '',
        disableOutputSubstitution: false,
      },
    );
  });

  it('recognizes files', () => {
    // txn files:
    assert.ok(DeeplinkSchemaMatch.isTXNFile('file://com.android.externalstorage.documents/document/081D-1403%3Atxhex.txn'));

    assert.ok(DeeplinkSchemaMatch.isTXNFile('content://com.android.externalstorage.documents/document/081D-1403%3Atxhex.txn'));

    assert.ok(!DeeplinkSchemaMatch.isTXNFile('content://com.android.externalstorage.documents/document/081D-1403%3Atxhex-signed.psbt'));
    assert.ok(!DeeplinkSchemaMatch.isTXNFile('file://com.android.externalstorage.documents/document/081D-1403%3Atxhex-signed.psbt'));

    // psbt files (unsigned):
    assert.ok(DeeplinkSchemaMatch.isPossiblyPSBTFile('content://com.android.externalstorage.documents/document/081D-1403%3Atxhex.psbt'));
    assert.ok(DeeplinkSchemaMatch.isPossiblyPSBTFile('file://com.android.externalstorage.documents/document/081D-1403%3Atxhex.psbt'));
  });

  it('can work with some deeplink actions', () => {
    assert.strictEqual(DeeplinkSchemaMatch.getServerFromSetElectrumServerAction('sgasdgasdgasd'), false);
    assert.strictEqual(
      DeeplinkSchemaMatch.getServerFromSetElectrumServerAction('bluewallet:setelectrumserver?server=electrum1.groestlcoin.org%3A443%3As'),
      'electrum1.groestlcoin.org:443:s',
    );
    assert.strictEqual(
      DeeplinkSchemaMatch.getServerFromSetElectrumServerAction('setelectrumserver?server=electrum1.groestlcoin.org%3A443%3As'),
      'electrum1.groestlcoin.org:443:s',
    );
    assert.strictEqual(
      DeeplinkSchemaMatch.getServerFromSetElectrumServerAction('ololo:setelectrumserver?server=electrum1.groestlcoin.org%3A443%3As'),
      false,
    );
    assert.strictEqual(
      DeeplinkSchemaMatch.getServerFromSetElectrumServerAction('setTrololo?server=electrum1.groestlcoin.org%3A443%3As'),
      false,
    );

    assert.strictEqual(
      DeeplinkSchemaMatch.getUrlFromSetLndhubUrlAction('bluewallet:setlndhuburl?url=https%3A%2F%2Flndhub.herokuapp.com'),
      'https://lndhub.herokuapp.com',
    );
    assert.strictEqual(
      DeeplinkSchemaMatch.getUrlFromSetLndhubUrlAction('bluewallet:setlndhuburl?url=https%3A%2F%2Flndhub.herokuapp.com%3A443'),
      'https://lndhub.herokuapp.com:443',
    );
    assert.strictEqual(
      DeeplinkSchemaMatch.getUrlFromSetLndhubUrlAction('setlndhuburl?url=https%3A%2F%2Flndhub.herokuapp.com%3A443'),
      'https://lndhub.herokuapp.com:443',
    );
    assert.strictEqual(DeeplinkSchemaMatch.getUrlFromSetLndhubUrlAction('gsom?url=https%3A%2F%2Flndhub.herokuapp.com%3A443'), false);
    assert.strictEqual(DeeplinkSchemaMatch.getUrlFromSetLndhubUrlAction('sdfhserhsthsd'), false);
  });

  it('should accept only the one valid format', function () {
    // has all the necessary json keys
    const isAllowed1 = '{"xfp":"ffffffff", "path":"m/84\'/17\'/0\'", "xpub":"Zpubsnkjansdjnjnekjwcnwkjnc"}';
    // has all the necessary json keys, different order
    const isAllowed2 = '{"path":"m/84\'/17\'/0\'", "xpub":"Zpubsnkjansdjnjnekjwcnwkjnc", "xfp":"ffffffff"}';

    //

    assert.strictEqual(DeeplinkSchemaMatch.hasNeededJsonKeysForMultiSigSharing(isAllowed1), true);
    assert.strictEqual(DeeplinkSchemaMatch.hasNeededJsonKeysForMultiSigSharing(isAllowed2), true);

    const isNotAllowed1 = '{"path":"m/84\'/17\'/0\'", "xpub":"Zpubsnkjansdjnjnekjwcnwkjnc"}';
    const isNotAllowed2 = '{"path":1233, "xpub":"Zpubsnkjansdjnjnekjwcnwkjnc", "xfp":"ffffffff"}';

    assert.strictEqual(DeeplinkSchemaMatch.hasNeededJsonKeysForMultiSigSharing(isNotAllowed1), false);
    assert.strictEqual(DeeplinkSchemaMatch.hasNeededJsonKeysForMultiSigSharing(isNotAllowed2), false);
  });

  it('onWalletSelect should work', async () => {
    const response = await asyncNavigationRouteFor({
      url: 'groestlcoin:GRS1Q6VE7QRZ0GG9TT22022RX620UEPKPKK2ED286GW?amount=0.00185579&lightning=LNBC1855790N1PNUPWSFPP5P5RVQJA067PV6NJQ3EFKLP78TN6MHUK842ZFGDCTXRDSGNTY765QDZ62PSKJEPQW3HJQSNPD36XJCEQFPHKUETEVFSKGEM9WGSRYVPJXSSZSNMJV3JHYGZFGSAZQARFVD4K2AR5V95KCMMJ9YCQZPUXQZ6GSP53E4EX9YTD2MGDN2C2CFA0J0SM3E7PVLPJ208H5LMYPNJMGZ7RLGS9QXPQYSGQ6GQMEQXJKKF2DHXJK8XQ4WGLM5NTE3RKEXGYQC6HYGFKS9SHHA6HL9X4339MXHNNQFSH7TS62PU8T9RSWTK6HQ4LV4GW3DPD25DQ8UQQYC909N',
    });
    assert.ok(response[1].onWalletSelect);

    let popWasCalled = false;
    let navigateWasCalled = false;
    let popWasCalled2 = false;
    let navigateWasCalled2 = false;
    const lw = new LightningCustodianWallet();
    const bw = new HDSegwitBech32Wallet();

    // navigation for a case when user selected LN wallet when was given a choice
    const navigationMock = {
      pop: () => {
        popWasCalled = true;
        // console.log('pop called');
      },
      navigate: (...args) => {
        navigateWasCalled = true;
        assert.deepStrictEqual(args, [
          'ScanLNDInvoiceRoot',
          {
            params: {
              uri: 'lightning:LNBC1855790N1PNUPWSFPP5P5RVQJA067PV6NJQ3EFKLP78TN6MHUK842ZFGDCTXRDSGNTY765QDZ62PSKJEPQW3HJQSNPD36XJCEQFPHKUETEVFSKGEM9WGSRYVPJXSSZSNMJV3JHYGZFGSAZQARFVD4K2AR5V95KCMMJ9YCQZPUXQZ6GSP53E4EX9YTD2MGDN2C2CFA0J0SM3E7PVLPJ208H5LMYPNJMGZ7RLGS9QXPQYSGQ6GQMEQXJKKF2DHXJK8XQ4WGLM5NTE3RKEXGYQC6HYGFKS9SHHA6HL9X4339MXHNNQFSH7TS62PU8T9RSWTK6HQ4LV4GW3DPD25DQ8UQQYC909N',
              walletID: 'bfcacb7288cf43c6c02a1154c432ec155b813798fa4e87cd2c1e5531d6363f71',
            },
            screen: 'ScanLNDInvoice',
          },
        ]);
      },
    };

    // navigation for a case when user selected ONCHAIN wallet when was given a choice
    const navigationMock2 = {
      pop: () => {
        popWasCalled2 = true;
      },
      navigate: (...args) => {
        navigateWasCalled2 = true;
        assert.deepStrictEqual(args, [
          'SendDetailsRoot',
          {
            params: {
              uri: 'groestlcoin:GRS1Q6VE7QRZ0GG9TT22022RX620UEPKPKK2ED286GW?amount=0.00185579&',
              walletID: 'a1c50c266e229bb66aca0221d5b6a116720004c97437a0a6e279cfea027d0c87',
            },
            screen: 'SendDetails',
            merge: true,
            pop: true,
          },
        ]);
      },
    };

    response[1].onWalletSelect(lw, { navigation: navigationMock });
    response[1].onWalletSelect(bw, { navigation: navigationMock2 });

    assert.ok(popWasCalled);
    assert.ok(navigateWasCalled);

    assert.ok(popWasCalled2);
    assert.ok(navigateWasCalled2);
  });
});

describe('unit - DeepLinkSchemaMatch picks a wallet', () => {
  const invoice =
    'lightning:lnbc10u1pwjqwkkpp5vlc3tttdzhpk9fwzkkue0sf2pumtza7qyw9vucxyyeh0yaqq66yqdq5f38z6mmwd3ujqar9wd6qcqzpgxq97zvuqrzjqvgptfurj3528snx6e3dtwepafxw5fpzdymw9pj20jj09sunnqmwqz9hx5qqtmgqqqqqqqlgqqqqqqgqjq5duu3fs9xq9vn89qk3ezwpygecu4p3n69wm3tnl28rpgn2gmk5hjaznemw0gy32wrslpn3g24khcgnpua9q04fttm2y8pnhmhhc2gncplz0zde';
  const address = 'bitcoin:12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG';
  const lnurl =
    'https://lnbits.com/?lightning=LNURL1DP68GURN8GHJ7MRWVF5HGUEWVDHK6TMHD96XSERJV9MJ7CTSDYHHVVF0D3H82UNV9UM9JDENFPN5SMMK2359J5RKWVMKZ5ZVWAV4VJD63TM';

  const paymentCode =
    'PM8TJS2JxQ5ztXUpBBRnpTbcUXbUHy2T1abfrb3KkAAtMEGNbey4oumH7Hc578WgQJhPjBxteQ5GHHToTYHE3A1w6p7tU6KSoFmWBVbFGjKPisZDbP97';

  const secondOnchainWallet = new HDSegwitBech32Wallet();
  secondOnchainWallet.setSecret('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');

  beforeEach(() => {
    presentAlert.mockClear();
  });

  it('skips wallets that cant send on the right chain', async () => {
    assert.strictEqual(watchOnlyWallet.allowSend(), false);

    const send = await asyncNavigationRouteFor({ url: address }, contextFor([lightningWallet, watchOnlyWallet, onchainWallet]));
    assert.strictEqual(send[1].params.walletID, onchainWallet.getID());
  });

  it('prefers the given wallet only if it is suitable', async () => {
    const wallets = [onchainWallet, secondOnchainWallet, lightningWallet];

    const preferred = await asyncNavigationRouteFor({ url: address }, contextFor(wallets, secondOnchainWallet.getID()));
    assert.strictEqual(preferred[1].params.walletID, secondOnchainWallet.getID());

    const wrongChain = await asyncNavigationRouteFor({ url: address }, contextFor(wallets, lightningWallet.getID()));
    assert.strictEqual(wrongChain[1].params.walletID, onchainWallet.getID());

    const secondLightningWallet = new LightningCustodianWallet();
    secondLightningWallet.setSecret('lndhub://login:password');
    assert.notStrictEqual(secondLightningWallet.getID(), lightningWallet.getID());
    const preferredLightning = await asyncNavigationRouteFor(
      { url: invoice },
      contextFor([lightningWallet, secondLightningWallet], secondLightningWallet.getID()),
    );
    assert.strictEqual(preferredLightning[1].params.walletID, secondLightningWallet.getID());
  });

  it('alerts instead of navigating when there is no suitable wallet', () => {
    const cases = [
      { url: address, wallets: [], message: loc.send.details_wallet_before_tx },
      { url: address, wallets: [lightningWallet, watchOnlyWallet], message: loc.send.details_wallet_before_tx },
      { url: invoice, wallets: [onchainWallet], message: loc.wallets.no_ln_wallet_error },
      { url: lnurl, wallets: [onchainWallet], message: loc.wallets.no_ln_wallet_error },
      { url: 'lnaddress@zbd.gg', wallets: [onchainWallet], message: loc.wallets.no_ln_wallet_error },
      { url: paymentCode, wallets: [lightningWallet], message: loc.send.details_wallet_before_tx },
      { url: 'bluewallet://widget?action=openSend', wallets: [], message: loc.send.details_wallet_before_tx },
      { url: 'bluewallet://widget?action=openReceive', wallets: [], message: loc.wallets.select_no_bitcoin },
    ];

    for (const { url, wallets, message } of cases) {
      presentAlert.mockClear();
      const completionHandler = jest.fn();
      DeeplinkSchemaMatch.navigationRouteFor({ url }, completionHandler, contextFor(wallets));
      assert.strictEqual(completionHandler.mock.calls.length, 0, url);
      assert.strictEqual(presentAlert.mock.calls.length, 1, url);
      assert.strictEqual(presentAlert.mock.calls[0][0].message, message);
    }
  });

  it('widget actions use the first wallet able to do the action', async () => {
    const send = await asyncNavigationRouteFor(
      { url: 'bluewallet://widget?action=openSend' },
      contextFor([watchOnlyWallet, lightningWallet, onchainWallet]),
    );
    assert.deepStrictEqual(send, ['ScanLNDInvoiceRoot', { screen: 'ScanLNDInvoice', params: { walletID: lightningWallet.getID() } }]);

    const receive = await asyncNavigationRouteFor(
      { url: 'bluewallet://widget?action=openReceive' },
      contextFor([watchOnlyWallet, lightningWallet, onchainWallet]),
    );
    assert.deepStrictEqual(receive, [
      'DrawerRoot',
      { screen: 'DetailViewStackScreensStack', params: { screen: 'ReceiveDetails', params: { walletID: watchOnlyWallet.getID() } } },
    ]);

    const onchainSend = await asyncNavigationRouteFor(
      { url: 'bluewallet://widget?action=openSend' },
      contextFor([onchainWallet, lightningWallet]),
    );
    assert.deepStrictEqual(onchainSend, [
      'SendDetailsRoot',
      { screen: 'SendDetails', merge: true, pop: true, params: { walletID: onchainWallet.getID() } },
    ]);

    const lightningReceive = await asyncNavigationRouteFor(
      { url: 'bluewallet://widget?action=openReceive' },
      contextFor([lightningWallet, onchainWallet]),
    );
    assert.deepStrictEqual(lightningReceive, [
      'LNDCreateInvoiceRoot',
      { screen: 'LNDCreateInvoice', params: { walletID: lightningWallet.getID() } },
    ]);

    const preferredSend = await asyncNavigationRouteFor(
      { url: 'bluewallet://widget?action=openSend' },
      contextFor([lightningWallet, onchainWallet], onchainWallet.getID()),
    );
    assert.strictEqual(preferredSend[1].params.walletID, onchainWallet.getID());
    assert.strictEqual(presentAlert.mock.calls.length, 0);
  });
});
