import { asym, base64, hash, smith, uuid } from '@do-ob/crypto';
import { Registration, Authenticator, Credential, ClientData, RegistrationOptions, Passkey } from '@do-ob/auth/api';
import * as keychain from '@do-ob/auth/keychain';

export interface RegistrationOptionsLocal extends RegistrationOptions {
  /**
   * Password for the passkey
   */
  password?: string;
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
}: RegistrationOptionsLocal) {
  const id = await uuid();

  /**
   * Generate a key pair.
   * 
   * If no password is supplied, the private key is NOT exportable.
   */
  const keypair = await asym.generate('signer', !!password);

  /**
   * Wrap the private key with a password.
   */
  const privateKeyExported = password ? 
    await smith.wrap(keypair.privateKey, password) :
    await keypair.privateKey;

  /**
   * Export the public key.
   */
  const publicKeyExported = await smith.exporterWebauthn(keypair.publicKey);

  /**
   * Create a passkey object.
   */
  const passkey: Passkey = {
    id,
    name: username,
    publicKey: publicKeyExported,
    privateKey: privateKeyExported as string,
    wrapped: !!password as true,
    algorithm: -7,
  };

  if (typeof window !== 'undefined') {
    /**
     * Insert the passkey into the browser keychain database.
     * (IndexedDB)
     */
    keychain.insert(passkey);
  } else {
    /**
     * Insert the passkey into the memory container.
     */
    memoryDb.insert(passkey);
  }

  const credential: Credential = {
    id,
    type: 'public-key',
    state: 'encoded',
    publicKey: publicKeyExported,
    algorithm: -7,
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

/**
 * A simple memeory container for passkeys if indexedDB is not available.
 */
let passkeys: Passkey[] = [];

export const memoryDb = {
/**
 * Insert a passkey into the memory container.
 */
  async insert(passkey: Passkey) {
    passkeys.push(passkey);
  },

  /**
 * Get a passkey from the memory container.
 */
  async get(id: string) {
    return passkeys.find((passkey) => passkey.id === id);
  },

  /**
 * Delete a passkey from the memory container.
 */
  async remove(id: string) {
    passkeys = passkeys.filter((passkey) => passkey.id !== id);
  },

  /**
 * Get all passkeys from the memory container.
 */
  async getAll() {
    return passkeys;
  },

  /**
   * Clear the memory container.
   */
  async clear() {
    passkeys = [];
  },

};
