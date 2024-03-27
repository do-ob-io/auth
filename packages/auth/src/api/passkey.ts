export interface Passkey {
  /**
   * The identifier of the passkey. Usually a username or email.
   */
  id: string;

  /**
   * Public key.
   */
  publicKey: CryptoKey | string;

  /**
   * Private key.
   */
  privateKey: CryptoKey | string;

  /**
   * The algorithm used to generate the keys.
   * 
   * -7: ES256
   * -257: RS256
   */
  algorithm: number;
}
