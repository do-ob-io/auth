import * as asym from './asym.js';
import { base64 } from '@do-ob/crypto/encode';
// import { webcrypto } from '../webcrypto.js';

/**
 * Sign a JSON object and return a JWT.
 */
export async function sign(
  json: Record<string, unknown>,
  privateKey?: CryptoKey,
) {
  const header = {
    /**
     * Algorithm used to sign the token.
     * ES256 = ECDSA using P-256 and SHA-256
     * 
     * https://datatracker.ietf.org/doc/html/rfc7518#section-3
     */
    alg: 'ES256', // ECDSA using P-256 and SHA-256
    typ: 'JWT',
  };

  const now = new Date().getTime() / 1000;

  const payload = {
    iat: now,
    exp: now,
    ...json,
  };

  const headerBase64 = base64.encodeJson(header);
  const payloadBase64 = base64.encodeJson(payload);

  const dataString = `${headerBase64}.${payloadBase64}`;

  const signature = await asym.sign(dataString, privateKey) as ArrayBuffer;
  const signatureBase64 = base64.encode(new Uint8Array(signature), true);

  return `${dataString}.${signatureBase64}`;
}

/**
 * Verify a JWT and return the payload if it is valid.
 */
export async function verify(
  encoded: string,
  publicKey?: CryptoKey,
) {
  const [headerB64, payloadB64, signatureB64] = encoded.split('.');

  if (!signatureB64 || !payloadB64 || !headerB64) {
    // console.warn('Token is not properly formatted');
    return undefined;
  }

  try {
    const header = base64.decodeJson(headerB64);
    const payload = base64.decodeJson(payloadB64);
    const now = new Date().getTime() / 1000;

    const signatureUnpadded = base64.decode(signatureB64);
    // const padding = new Uint8Array([187]);
    const signature = new Uint8Array(64);
    signature.set(signatureUnpadded);
    const verified = await asym.verify(
      `${headerB64}.${payloadB64}`,
      signature.buffer,
      publicKey,
    );

    if (header.typ !== 'JWT') {
      // console.warn('Header is not formatted correctly');
      return undefined;
    }

    if (!verified) {
      // console.warn('Could not verify token');
      return undefined;
    }

    if (!payload.exp || payload.exp <= now) {
      // console.warn('Token has expired');
      return undefined;
    }

    return payload;
  } catch (error) {
    // console.error('Failed to parse token');
    return undefined;
  }
}

export type TokenDecoded<T = Record<string, unknown>> = [
  payload: T,
  raw: string,
  signature: ArrayBuffer,
];

/**
 * Decode a JWT and return the payload if it is valid.
 */
export async function decode<T = Record<string, unknown>>(
  encoded: string,
): Promise<TokenDecoded<T> | []> {
  const [headerB64, payloadB64, signatureB64] = encoded.split('.');

  if (!signatureB64 || !payloadB64 || !headerB64) {
    // console.warn('Token is not properly formatted');
    return [];
  }

  try {
    const payload = base64.decodeJson(payloadB64) as T;
    const sigature = base64.decode(signatureB64);

    if (!payload) {
      return [];
    }

    return [payload, `${headerB64}.${payloadB64}`, sigature.buffer];
  } catch (error) {
    // console.error('Failed to parse token');
    return [];
  }
}
