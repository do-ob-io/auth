/**
 * Enumeration of authenticator flags
 */
export enum AuthenticatorFlags {
  /**
   * User Present (UP), Bit 0
   * 
   * The authenticator validated that the user was present through some Test of User Presence (TUP), such as touching a button on the authenticator.
   */
  UP = 0b0000_0001,

  /**
   * User Verified (UV), Bit 2
   * 
   * If set, the authenticator verified the actual user through a biometric, PIN, or other method.
   */
  UV = 0b0000_0100,

  /**
   * Backup Eligibility (BE), Bit 3
   * 
   * If set, the authenticator has the capability to store a backup of the user's credentials.
   */
  BE = 0b0000_1000,

  /**
   * Backup State (BS), Bit 4
   * 
   * If set, the authenticator has stored a backup of the user's credentials.
   */
  BS = 0b0001_0000, 

  /**
   * Attested Credential Data (AT), Bit 6
   * 
   * If set, the authenticator has attested to the validity of the credential public key.
   */
  AT = 0b0100_0000,

  /**
   * Extension Data (ED), Bit 7
   * 
   * If set, the authenticator has additional extension data.
   */
  ED = 0b1000_0000,
}

/**
 * Authenticator data interface
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/Authenticator_data
 */
export interface Authenticator {
  /**
   * The SHA-256 hash of the Relying Party ID that the credential is scoped to.
   */
  rpIdHash: string;

  /**
   * A bitfield that indicates various attributes that were asserted by the authenticator.
   */
  flags: number;

  /**
   * A signature counter, if supported by the authenticator (set to 0 otherwise).
   */
  counter: number;

  /**
   * The Authenticator Attestation Globally Unique Identifier, a unique number that identifies the model of the authenticator (not the specific instance of the authenticator).
   * 
   * @see https://fidoalliance.org/metadata/
   */
  aaguid: string;

  /**
   * The name of the authenticator.
   */
  name: string;
}
