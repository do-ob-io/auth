import { base64 } from '@do-ob/crypto/encode';
import { webcrypto } from '@do-ob/crypto/webcrypto';

/**
 * Hash data with SHA-256.
 */
export async function hash(data: string) {
  const wc = await webcrypto();
  const encoded = new TextEncoder().encode(data);
  const hash = await wc.subtle.digest('SHA-256', encoded);
  const hashUint8 = new Uint8Array(hash);
  const hashB64 = base64.encode(hashUint8, true);
  return hashB64;
}
