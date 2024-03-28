export interface CredentialBase {
  /**
   * The credential id that was provided.
   */
  id: string;

  /**
   * The credential's type.
   */
  type: 'public-key';

  /**
   * Base64 encoded public key.
   */
  publicKey: string;

  /**
   * The credential's algorithm.
   */
  algorithm: number;
}

export interface CredentialPublicKeyEncoded extends Omit<CredentialBase, 'publicKey'> {
  /**
   * The credential type is public key.
   */
  type: 'public-key',

  /**
   * Credential has encoded information.
   */
  state: 'encoded',

  /**
   * The base64 encoded credential public key.
   */
  publicKey: string;

  /**
   * The credential's algorithm.
   */
  algorithm: -7 | -257 | number;
} 

export interface CredentialPublicKeyDecoded extends Omit<CredentialBase, 'publicKey'> {
  /**
   * The credential type is public key.
   */
  type: 'public-key',

  /**
   * Credential has decoded information.
   */
  state: 'decoded',

  /**
   * The credential public key.
   */
  publicKey: CryptoKey;

  /**
   * The credential's algorithm.
   */
  algorithm: -7 | -257 | number;
}

/**
 * A credential object.
 */
export type Credential = CredentialPublicKeyEncoded | CredentialPublicKeyDecoded;
