import untypedFiatUnit from './fiatUnits.json';

export const FiatUnitSource = {
  CoinGecko: 'CoinGecko',
} as const;

const handleError = (source: string, ticker: string, error: Error) => {
  throw new Error(
    `Could not update rate for ${ticker} from ${source}: ${error.message}. ` + `Make sure the network you're on has access to ${source}.`,
  );
};

const fetchRate = async (url: string): Promise<unknown> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

interface CoinGeckoResponse {
  groestlcoin: {
    [ticker: string]: number;
  };
}

const RateExtractors = {
  CoinGecko: async (ticker: string): Promise<number> => {
    try {
      const json = (await fetchRate(
        `https://api.coingecko.com/api/v3/simple/price?ids=groestlcoin&vs_currencies=${ticker.toLowerCase()}`,
      )) as CoinGeckoResponse;
      const rate = Number(json?.groestlcoin?.[ticker.toLowerCase()]);
      if (!(rate >= 0)) throw new Error('Invalid data received');
      return rate;
    } catch (error: any) {
      handleError('CoinGecko', ticker, error);
      return undefined as never;
    }
  },
} as const;

export type TFiatUnit = {
  endPointKey: string;
  symbol: string;
  locale: string;
  country: string;
  source: 'CoinGecko';
};

export type TFiatUnits = {
  [key: string]: TFiatUnit;
};

export const FiatUnit = untypedFiatUnit as TFiatUnits;

export type FiatUnitType = {
  endPointKey: string;
  symbol: string;
  locale: string;
  country: string;
  source: keyof typeof FiatUnitSource;
};

export async function getFiatRate(ticker: string): Promise<number> {
  return await RateExtractors[FiatUnit[ticker].source](ticker);
}
