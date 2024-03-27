import { asym, base64, hash, smith, uuid } from '@do-ob/crypto';
import { Registration, Authenticator, Credential, ClientData, RegistrationOptions } from '@do-ob/auth/api';

export interface RegistrationOptionsLocal extends RegistrationOptions {
  /**
   * Password for the passkey
   */
  password: string;

  /**
   * The storage function for the private key.
   */
  storage?: (privateKey: CryptoKey) => void;
}

/**
 * Creates a registration object locally by supplying a password.
 * 
 * Works in Node.js and in the browser.
 */
export async function register({
  username,
  challenge,
  origin = 'localhost',
  password,
  storage = () => {},
}: RegistrationOptionsLocal) {
  const id = await uuid();

  /**
   * Generate a key pair.
   */
  const keypair = await asym.generate('signer', false);

  /**
   * Store the private key.
   */
  storage(keypair.privateKey);

  const credential: Credential = {
    id,
    type: 'public-key',
    state: 'encoded',
    publicKey: await smith.exporterWebauthn(keypair.publicKey),
    algorithm: -7,
    password,
  };

  const clientData: ClientData = {
    type: 'webauthn.register',
    challenge,
    origin,
    authenticator: 'webauthn',
  };

  const authenticator: Authenticator = {
    rpIdHash: await hash(origin),
    flags: 0,
    counter: 0,
    aaguid: '00000000-0000-0000-0000-000000000000',
    name: 'Web Cryptography API',
  };

  const registration: Registration = {
    state: 'encoded',
    username,
    credential: base64.encodeJson(credential),
    clientData: base64.encodeJson(clientData),
    authenticator: base64.encodeJson(authenticator),
  };

  return registration;
}
