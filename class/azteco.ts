import URL from 'url';
import { fetch } from '../util/fetch';

export default class Azteco {
  /**
   * Redeems an Azteco bitcoin voucher.
   *
   * @param {string[]} voucher - 16-digit voucher code in groups of 4.
   * @param {string} address - Bitcoin address to send the redeemed bitcoin to.
   *
   * @returns {Promise<boolean>} Successfully redeemed or not. This method does not throw exceptions
   */
  static async redeem(voucher: string[], address: string): Promise<boolean> {
    const baseURI = 'https://azte.co/';
    const url = `${baseURI}blue_despatch.php?CODE_1=${voucher[0]}&CODE_2=${voucher[1]}&CODE_3=${voucher[2]}&CODE_4=${voucher[3]}&ADDRESS=${address}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      return response && response.status === 200;
    } catch (_) {
      return false;
    }
  }

  static isRedeemUrl(u: string): boolean {
    return u.startsWith('https://azte.co');
  }

  static getParamsFromUrl(u: string) {
    const urlObject = URL.parse(u, true); // eslint-disable-line n/no-deprecated-api

    if (urlObject.query.code) {
      // check if code is a string
      if (typeof urlObject.query.code !== 'string') {
        throw new Error('Invalid URL');
      }

      // newer format of the url
      return {
        uri: u,
        c1: urlObject.query.code.substring(0, 4),
        c2: urlObject.query.code.substring(4, 8),
        c3: urlObject.query.code.substring(8, 12),
        c4: urlObject.query.code.substring(12, 16),
      };
    }

    return {
      uri: u,
      c1: urlObject.query.c1,
      c2: urlObject.query.c2,
      c3: urlObject.query.c3,
      c4: urlObject.query.c4,
    };
  }
}
