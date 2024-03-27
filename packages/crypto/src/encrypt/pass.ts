import { base64 } from '@do-ob/crypto/encode';
import { webcrypto } from '@do-ob/crypto/webcrypto';

const saltLength = 16;

/**
 * Encrypt a password with a salt.
 */
export async function encrypt(password: string, salt: Uint8Array) {
  const wc = await webcrypto();
  const passEncoded = new TextEncoder().encode(password);
  const passKey = await wc.subtle.importKey(
    'raw',
    passEncoded,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );

  const derivedBits = await wc.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1e6,
      hash: 'SHA-256',
    },
    passKey,
    256,
  );

  const derived = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + derived.length);
  combined.set(salt);
  combined.set(derived, salt.length);
  const encoded = base64.encode(combined);

  return encoded;
}

/**
 * Extract the salt from a hashed password.
 */
export function extract(hashtext: string) {
  const uint8 = base64.decode(hashtext);
  return uint8.slice(0, saltLength);
}

/**
 * Hash a plaintext password.
 */
export async function hash(plaintext: string) {
  const wc = await webcrypto();
  const salt = wc.getRandomValues(new Uint8Array(saltLength));
  const passEncrypted = await encrypt(plaintext, salt);
  return passEncrypted;
}

/**
 * Compare a plaintext password to a hashed password.
 */
export async function compare(plaintext: string, hashtext: string) {
  const salt = extract(hashtext);
  const currentPassHash = await encrypt(plaintext, salt);
  return hashtext === currentPassHash;
}
