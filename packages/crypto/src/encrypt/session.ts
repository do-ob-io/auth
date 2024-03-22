import { base64 } from '@do-ob/crypto/encode';
import * as sym from './sym.js';

export type Session = { exp: number };

/**
 * Encode and encrypt a session.
 */
export async function encrypt<T extends Session = Session>(
  session: T,
  key?: CryptoKey,
) {
  const sessionPrep = {
    ...session,
    exp: Math.floor(session.exp / 1000),
  };
  const encrypted = await sym.encrypt(base64.encodeJson(sessionPrep), key);

  return encrypted;
}

export enum SessionError {
  DecryptionFailed,
  Expired,
  CantParse,
}

/**
 * Decrypt and decode a session.
 */
export async function decrypt<T extends Session = Session>(
  encryption: string,
  key?: CryptoKey,
): Promise<T | SessionError>{
  try {
    const decypted = await sym.decrypt(encryption, key);
    if (!decypted) {
      return SessionError.DecryptionFailed;
    }

    const json = base64.decodeJson<T>(decypted);

    const session = {
      ...json,
      exp: json.exp * 1000,
    };

    /**
     * Ensure the session didn't expire.
     */
    const now = new Date().getTime();
    if (session.exp <= now) {
      return SessionError.Expired;
    }

    return session;
  } catch (error) {
    return SessionError.CantParse;
  }
}
