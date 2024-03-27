import { Credential } from './credential.ts';
import { ClientData } from './clientData.ts';
import { Authenticator } from './authenticator.ts';

export interface RegistrationOptions {
  /**
   * The username of the user.
   */
  username: string;

  /**
   * The challenge from the server.
   */
  challenge: string;

  /**
   * Hostname origin of the client.
   */
  origin?: string;
}

export interface RegistrationBase {
  /**
   * The username to register.
   */
  username: string;

  /**
   * An attestation signature of the registration data.
   */
  signature?: string;
}

export interface RegistrationEncoded extends RegistrationBase {
  /**
   * The registration has encoded information.
   */
  state: 'encoded';

  /**
   * Base64 encoded credential information.
   */
  credential: string;

  /**
   * Base64 encoded client data.
   */
  clientData: string;

  /**
   * Base64 encoded authenticator data.
   */
  authenticator: string;
}

export interface RegistrationDecoded extends RegistrationBase {
  /**
   * The registration has decoded information.
   */
  state: 'decoded';

  /**
   * The credential information.
   */
  credential: Credential;

  /**
   * The client data.
   */
  clientData: ClientData;

  /**
   * Authenticator data.
   */
  authenticator: Authenticator;
}

/**
 * A registration object.
 */
export type Registration = RegistrationEncoded | RegistrationDecoded;
