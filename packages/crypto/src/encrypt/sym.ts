import { base64 } from '@do-ob/crypto/encode';
import { webcrypto } from '@do-ob/crypto/webcrypto';

/**
 * Generate a new AES-GCM key.
 */
export async function generate () {
  const wc = await webcrypto();
  const key = await wc.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return key;
}

let symKey: CryptoKey | undefined;

/**
 * Get the singleton AES-GCM key.
 */
async function singleton() {
  if (!symKey) {
    symKey = await generate();
  }
  return symKey;
}

/**
 * Set the default singleton AES-GCM key.
 */
export async function set(key: CryptoKey) {
  symKey = key;
}

/**
 * Encrypt data with an AES-GCM key.
 */
export async function encrypt(
  data: string,
  key?: CryptoKey
) {
  const wc = await webcrypto();
  const iv = wc.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);

  const cipherKey = key || (await singleton());

  const cipher = await wc.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cipherKey,
    encoded,
  );

  const cipherUint8 = new Uint8Array(cipher);
  const encryption = new Uint8Array(iv.length + cipherUint8.length);
  encryption.set(iv);
  encryption.set(cipherUint8, iv.length);

  const encryptionB64 = base64.encode(encryption);

  return encryptionB64;
}

/**
 * Decrypt data with an AES-GCM key.
 */
export async function decrypt(
  encryption: string,
  key?: CryptoKey
) {
  const wc = await webcrypto();
  const cipherKey = key || (await singleton());

  const encryptionUint8 = base64.decode(encryption);
  const iv = encryptionUint8.slice(0, 12);
  const cipher = encryptionUint8.slice(12);

  try {
    const decrypted = await wc.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      cipherKey,
      cipher.buffer,
    );

    const data = new TextDecoder().decode(decrypted);

    return data;
  } catch (error) {
    return undefined;
  }
}
