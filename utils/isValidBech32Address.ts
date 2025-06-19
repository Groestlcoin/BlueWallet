import * as bitcoin from 'groestlcoinjs-lib';

export function isValidBech32Address(address: string): boolean {
  try {
    bitcoin.address.fromBech32(address);
    return true;
  } catch (e) {
    return false;
  }
}
