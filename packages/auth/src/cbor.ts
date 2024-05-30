import type { Decoder } from 'cbor';

export type CborDecode = (input: Decoder.BufferLike, options?: string | Decoder.DecoderOptions) => unknown;

let decoderInstance: CborDecode | undefined;

/**
 * Polyfill for CBOR encoding/decoding.
 * 
 * For webauthn, we should only need the decoder.
 */
export const getCborDecode = async (): Promise<CborDecode> => {
  if (!decoderInstance) {
    if(typeof window === 'undefined') {
      decoderInstance = (await import('cbor')).decodeAllSync;
    }
    decoderInstance = (await import('cbor-web')).decodeAllSync;
  }

  return decoderInstance;
};
