// import type { RegistrationDecoded } from '@do-ob/auth/api';

import { base64, hex, utf8, uuid } from '@do-ob/crypto';
import { authenticators } from '@do-ob/auth/meta';
import { Authenticator, RegistrationOptions, Registration, Credential, ClientData } from '@do-ob/auth/api';

interface WebauthnClientData {
  challenge: string;
  crossOrigin?: boolean;
  origin: string;
  type: 'webauthn.create' | 'webauthn.get';
}

/**
 * Parses an authenticator response.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API/Authenticator_data
 */
export async function parseAuthenticatorData(athenticatorData: ArrayBuffer) {
  // The SHA-256 hash of the Relying Party ID that the credential is scoped to.
  const rpIdHash = base64.encode(athenticatorData.slice(0, 32));

  // The flags bit field as a number.
  const flags: number = new DataView(athenticatorData.slice(32,33)).getUint8(0);

  // Get the 4 bytes of the signature counter.
  const counter: number = new DataView(athenticatorData.slice(33, 37)).getUint32(0, false);

  let aaguid: string = '00000000-0000-0000-0000-000000000000';
  // If the array if longer, there's additional information.
  if (athenticatorData.byteLength > 37) {
    // Get the 16 bytes of the AAGUID as a hex string.
    aaguid = hex.encode(athenticatorData.slice(37, 53));
    // Convert the AAGUID to a GUID string using substring.
    aaguid = `${aaguid.substring(0, 8)}-${aaguid.substring(8, 12)}-${aaguid.substring(12, 16)}-${aaguid.substring(16, 20)}-${aaguid.substring(20)}`;
  }

  const name = authenticators[aaguid] ?? 'Unknown';

  const result: Authenticator = {
    rpIdHash,
    flags,
    counter,
    aaguid,
    name,
  };

  return result;
}

/**
 * Creates a registration object.
 */
export async function register({
  username,
  challenge,
  origin,
}: RegistrationOptions) {

  if (typeof window === 'undefined') {
    throw new Error('WebAuthn is not supported in this environment.');
  }
    
  const canLocalAuth = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

  /**
   * Generate a random user ID.
   */
  const userId = await uuid();

  /**
   * Create the public key options.
   */
  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
    rp: {
      id: origin ?? window.location.hostname,
      name: origin ?? window.location.hostname,
    },
    user: {
      id: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ECDSA with SHA-256 (WebAuthn Default)
      { type: 'public-key', alg: -257 } // RSASSA-PKCS1-v1_5 with SHA-256 (Windows Hello)
    ],
    authenticatorSelection: {
      userVerification: 'required',
      authenticatorAttachment: canLocalAuth ? 'platform' : 'cross-platform',
      residentKey: 'preferred',
      requireResidentKey: false,
    },
    attestation: 'direct',
  };

  /**
   * Create the credential.
   */
  const pkCredential = await navigator.credentials.create({
    publicKey: publicKeyOptions
  }) as PublicKeyCredential | null;

  if (!pkCredential) {
    throw new Error('Failed to create credential for registration');
  }

  /**
   * Store the credential.
   */
  navigator.credentials.store(pkCredential);

  /**
   * Get the response casted as an AuthenticatorAttestationResponse.
   */
  const response = pkCredential.response as AuthenticatorAttestationResponse;

  /**
   * Extract credential response information.
   */
  const authenticator = await parseAuthenticatorData(response.getAuthenticatorData());
  const publicKey = base64.encode(response.getPublicKey());
  const algorithm = response.getPublicKeyAlgorithm();
  const webauthnClientData = utf8.decodeJson<WebauthnClientData>(response.clientDataJSON);

  const credential: Credential = {
    id: pkCredential.id,
    type: 'public-key',
    state: 'encoded',
    publicKey,
    algorithm,
  };

  const clientData: ClientData = {
    type: 'webauthn.register',
    challenge: webauthnClientData.challenge,
    origin: webauthnClientData.origin,
    authenticator: 'webauthn',
  };

  /**
   * Create the registration object.
   */
  const registration: Registration = {
    state: 'encoded',
    username,
    credential: base64.encodeJson(credential),
    clientData: base64.encodeJson(clientData),
    authenticator: base64.encodeJson(authenticator),
  };

  return registration;
}
