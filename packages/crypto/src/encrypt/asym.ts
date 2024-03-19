import { webcrypto } from '@do-ob/crypto/webcrypto';

export type CryptoKeyPair = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

export type CryptoAsymType = 'encryptor' | 'signer';

/**
 * Singleton RSA instances.
 */
let asymKeyPairEncryptor: CryptoKeyPair | undefined;
let asymKeyPairSigner: CryptoKeyPair | undefined;

/**
 * Generate a new RSA Key Pair
 */
export async function generate(type: CryptoAsymType): Promise<CryptoKeyPair> {
  const wc = await webcrypto();

  if (type === 'encryptor') {
    const keyPairGen = await wc.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt'],
    );

    return {
      privateKey: keyPairGen.privateKey,
      publicKey: keyPairGen.publicKey,
    };
  }

  const keyPairGen = await wc.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify'],
  );

  return {
    privateKey: keyPairGen.privateKey,
    publicKey: keyPairGen.publicKey,
  };
}

/**
 * Gets the singlton an RSA Key Pair.
 */
export async function singleton (type: CryptoAsymType): Promise<CryptoKeyPair> {
  if (!asymKeyPairEncryptor) {
    asymKeyPairEncryptor = await generate('encryptor');
  }
  if (!asymKeyPairSigner) {
    asymKeyPairSigner = await generate('signer');
  }

  if (type === 'encryptor') {
    return asymKeyPairEncryptor;
  }

  return asymKeyPairSigner;
}

/**
 * Set the default asymetric encryption key pair.
 */
export async function set(
  type: CryptoAsymType,
  publicKey: CryptoKey,
  privateKey: CryptoKey,
) {
  if (type === 'encryptor') {
    asymKeyPairEncryptor = { publicKey, privateKey };
  } else {
    asymKeyPairSigner = { publicKey, privateKey };
  }
}

/**
 * Encrypts data with RSA keys
 */
export async function encrypt(
  data: string,
  publicKey?: CryptoKey,
): Promise<ArrayBuffer> {
  const wc = await webcrypto();
  const key = publicKey || (await singleton('encryptor')).publicKey;
  const unit8 = new TextEncoder().encode(data);
  const encryption = await wc.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    unit8,
  );
  return encryption;
}

/**
 * Decrypts data with RSA keys
 */
export async function decrypt(
  encryption: ArrayBuffer,
  privateKey?: CryptoKey,
) {
  const wc = await webcrypto();
  const key = privateKey || (await singleton('encryptor')).privateKey;
  try {
    const decrypt = await wc.subtle.decrypt(
      { name: 'RSA-OAEP' },
      key,
      encryption,
    );
    return new TextDecoder().decode(decrypt);
  } catch (error) {
    return undefined;
  }
}

/**
 * Signs data with RSA keys
 */
export async function sign(
  data: string,
  privateKey?: CryptoKey,
) {
  const wc = await webcrypto();
  const key = privateKey || (await singleton('signer')).privateKey;
  const uint8 = new TextEncoder().encode(data);
  const signature = await wc.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    uint8,
  );
  return signature;
}

/**
 * Verifies data with RSA keys
 */
export async function verify(
  data: string,
  signature: ArrayBuffer,
  publicKey?: CryptoKey,
) {
  const wc = await webcrypto();
  const key = publicKey || (await singleton('signer')).publicKey;
  const unit8 = new TextEncoder().encode(data);
  try {
    const result = await wc.subtle.verify(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      key,
      signature,
      unit8,
    );
    return result;
  } catch (error) {
    return false;
  }
}
