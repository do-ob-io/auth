export interface PasskeyBase {
  /**
   * The identifier of the passkey.
   */
  id: string;

  /**
   * The name of the passkey. Usually a username or email.
   */
  name: string;

  /**
   * Public key.
   */
  publicKey: string;

  /**
   * Private key.
   */
  privateKey: CryptoKey | string;

  /**
   * Determines with the private key was wrapped with a password.
   */
  wrapped: boolean;

  /**
   * The algorithm used to generate the keys.
   * 
   * -7: ES256
   * -257: RS256
   */
  algorithm: number;
}

export interface PasskeyExportable extends PasskeyBase {
  /**
   * Private key.
   */
  privateKey: CryptoKey;

  /**
   * Determines with the private key was wrapped with a password.
   */
  wrapped: false;
}

export interface PasskeyWrapped extends PasskeyBase {
  /**
   * Private key.
   */
  privateKey: string;

  /**
   * Determines with the private key was wrapped with a password.
   */
  wrapped: true;
}

export type Passkey = PasskeyExportable | PasskeyWrapped;
