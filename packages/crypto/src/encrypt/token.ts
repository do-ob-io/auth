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

export enum TokenError {
  InvalidFormat,
  InvalidHeader,
  InvalidPayload,
  InvalidSignature,
  Expired,
  CantParse,
}

/**
 * Verify a JWT and return the payload if it is valid.
 */
export async function verify<T = Record<string, unknown>>(
  encoded: string,
  publicKey?: CryptoKey,
): Promise<T | TokenError>{
  const [headerB64, payloadB64, signatureB64] = encoded.split('.');

  if (!signatureB64 || !payloadB64 || !headerB64) {
    return TokenError.InvalidFormat;
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
      return TokenError.InvalidHeader;
    }

    if (!verified) {
      return TokenError.InvalidSignature;
    }

    if (!payload.exp || payload.exp <= now) {
      return TokenError.Expired;
    }

    return payload;
  } catch (error) {
    return TokenError.CantParse;
  }
}

export type TokenDecoded<T = Record<string, unknown>> = {
  payload?: T,
  raw: string,
  signature?: ArrayBuffer,
  error?: TokenError,
};

/**
 * Decode a JWT and return the payload WITHOUT validation.
 */
export async function decode<T = Record<string, unknown>>(
  encoded: string,
): Promise<TokenDecoded<T>> {
  const [headerB64, payloadB64, signatureB64] = encoded.split('.');

  if (!signatureB64 || !payloadB64 || !headerB64) {
    return {
      raw: encoded,
      error: TokenError.InvalidFormat,
    };
  }

  try {
    const payload = base64.decodeJson(payloadB64) as T;
    const sigature = base64.decode(signatureB64);

    return {
      payload,
      raw: `${headerB64}.${payloadB64}`,
      signature: sigature.buffer,
    };
  } catch (error) {
    return {
      raw: encoded,
      error: TokenError.CantParse
    };
  }
}
