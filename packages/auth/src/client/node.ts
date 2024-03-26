import { asym, base64, smith, uuid } from '@do-ob/crypto';
import { Registration, Credential, ClientData, RegistrationOptions } from '@do-ob/auth/api';

export interface RegistrationOptionsNode extends RegistrationOptions {
  /**
   * The key pair to use for registration.
   */
  keyPair?: CryptoKeyPair;
}

/**
 * Creates a registration object.
 */
export async function register({
  username,
  challenge,
  origin = 'localhost',
  keyPair,
}: RegistrationOptionsNode) {
  if (!keyPair) {
    keyPair = await asym.generate('signer');
  }

  const id = await uuid();

  const credential: Credential = {
    id,
    type: 'public-key',
    state: 'encoded',
    publicKey: await smith.exporter(keyPair.publicKey),
    algorithm: -7,
  };

  const clientData: ClientData = {
    type: 'webauthn.register',
    challenge,
    origin,
    authenticator: 'webauthn',
  };

  const registration: Registration = {
    state: 'encoded',
    username,
    credential: base64.encodeJson(credential),
    clientData: base64.encodeJson(clientData),
  };

  return registration;
}
