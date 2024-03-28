import { Challenge, ClientData, Credential, Authenticator, Registration } from '@do-ob/auth/api';
import { base64, random } from '@do-ob/crypto/encode';

/**
 * A Map of challenges.
 */
const challangeMap = new Map<string, Challenge>();

/**
 * A stored time of the last cleanup.
 */
const lastCleanup = Date.now();

/**
 * Cleans up the challenge map by removing expired challenges.
 */
async function cleanup() {
  // Only clean up at least once a minute.
  if (lastCleanup + 60000 > Date.now()) {
    return;
  }
  for (const [id, challenge] of challangeMap) {
    if (challenge.expires < Date.now()) {
      challangeMap.delete(id);
    }
  }
}

export interface InitiateOptions {
  /**
   * The request to some action to initiate.
   */
  request: 'webauthn.register' | 'webauthn.login';

  /**
   * How long the action is valid after the request. The default is one minute.
   * 
   * @default 60000
   */
  expires?: number;
}

/**
 * Initializes the WebAuthn registration or login process
 * by creating and storaging a challenge.
 */
export async function initiate({
  request,
  expires = 60000,
}: InitiateOptions): Promise<Challenge> {
  cleanup(); // Clean up expired challenges if needed.

  const challenge: Challenge = {
    id: await random.chars(32),
    purpose: request,
    expires: Date.now() + expires,
  };

  challangeMap.set(challenge.id, challenge);

  return challenge;
}

/**
 * Processes a registration request from a client.
 */
export async function register(registration: Registration) {

  let username: string;
  let credential: Credential;
  let clientData: ClientData;
  let authenticator: Authenticator;

  if (registration.state === 'encoded') {
    username = registration.username;
    credential = base64.decodeJson<Credential>(registration.credential);
    clientData = base64.decodeJson<ClientData>(registration.clientData);
    authenticator = base64.decodeJson<Authenticator>(registration.authenticator);
  } else {
    username = registration.username;
    credential = registration.credential;
    clientData = registration.clientData;
    authenticator = registration.authenticator;
  }

  // Check the challenge.
  const challenge = challangeMap.get(clientData.challenge);
  if (!challenge) {
    throw new Error('Invalid challenge');
  }

  // Check the challenge purpose.
  if (challenge.purpose !== 'webauthn.register') {
    throw new Error('Invalid purpose');
  }

  // Check the challenge expiration.
  if (challenge.expires < Date.now()) {
    throw new Error('Challenge expired');
  }

  const result: Registration = {
    username: username,
    state: 'decoded',
    credential,
    clientData,
    authenticator,
  };

  return result;
}
