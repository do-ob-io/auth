import { base64 } from '@do-ob/crypto/encode';
import { webcrypto } from '@do-ob/crypto/webcrypto';

/**
 * The hash algorithm to use.
 */
export type HashAlgorithm =
  | 'SHA-1'
  | 'SHA-256'
  | 'SHA-384'
  | 'SHA-512';

/**
 * Hash data with SHA-256.
 */
export async function hash(
  /**
   * The data to hash.
   */
  data: string,

  /**
   * Optionally set another hash algorithm to use.
   */
  algorithm: HashAlgorithm = 'SHA-256'
) {
  const wc = await webcrypto();
  const encoded = new TextEncoder().encode(data);
  const hash = await wc.subtle.digest(algorithm, encoded);
  const hashUint8 = new Uint8Array(hash);
  const hashB64 = base64.encode(hashUint8, true);
  return hashB64;
}
