/**
 * Types of authentication operations.
 */
export type ClientDataType = 'webauthn.register' | 'webauthn.login' | 'ms-entra-id.register' | 'ms-entra-id.login';

/**
 * Data obtained from a client application.
 */
export interface ClientData {
  /**
   * The authenticator name.
   */
  authenticator: 'webauthn' | 'ms-entra-id';

  /**
   * The client's obtained nonce challenge string.
   */
  challenge: string;

  /**
   * The origin of the client application.
   */
  origin: string;

  /**
   * The type of requesting authentication operation.
   */
  type: ClientDataType;
}
