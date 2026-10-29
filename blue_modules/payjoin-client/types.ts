import { Psbt } from 'groestlcoinjs-lib';

export type PsbtInput = Psbt['data']['inputs'][number];
export type PsbtOutput = Psbt['data']['outputs'][number];

export interface PayjoinClientOptionalParameters {
  disableOutputSubstitution?: boolean;
  payjoinVersion?: number;
  additionalFeeOutputIndex?: number;
  maxAdditionalFeeContribution?: number;
  minimumFeeRate?: number;
}
