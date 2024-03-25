import { webcrypto } from '@do-ob/crypto/webcrypto';

/**
 * Generate a random version 4 UUID.
 */
export async function uuid() {
  const wc = await webcrypto();
  return wc.randomUUID();
}
