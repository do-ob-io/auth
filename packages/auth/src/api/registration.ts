import { Credential } from './credential.ts';
import { ClientData } from './clientData.ts';
import { Authenticator } from './authenticator.ts';

export interface RegistrationOptions {
  /**
   * The username of the user. This will be the name of the user's passkey on their device.
   */
  username: string;

  /**
   * The one-time nonce challenge from the server.
   */
  challenge: string;

  /**
   * Hostname origin of the client.
   */
  origin?: string;

  /**
   * The preferred authenticator attachment. If not set, the authenticator will perfer 'platform' if the device is capable.
   * 
   * 'platform' - The authenticator is attached to the platform without a sperate external device.
   * 'cross-platform' - The authenticator is attached to a separate external device (via USB, Bluetooth, etc).
   * 
   * @default undefined
   */
  attachment?: AuthenticatorAttachment;

  /**
   * Should the server attempt attestations?
   * That is, verify the authenticity of the authenticator.
   * 
   * @default false
   */
  attest?: boolean;
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
