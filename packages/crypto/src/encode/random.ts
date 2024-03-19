import * as base64 from './base64.ts';
import { webcrypto } from '@do-ob/crypto/webcrypto';

/**
 * Generate a random encoded string of characters.
 */
export async function chars(
  /**
   * The length of the random string.
   */
  length = 128
) {
  const wc = await webcrypto();
  const random = wc.getRandomValues(new Uint8Array(length));
  const data = base64.encode(random).slice(0, length);
  return data;
}
