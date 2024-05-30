// import React from 'react';
import { client, server } from '@do-ob/auth';
import { base64 } from '@do-ob/crypto/encode';
import { getCborDecode } from '@do-ob/auth/cbor';

export type RegisterRequest = {
  origin: string;
  type: 'webauthn.create';
  username: string;
  challenge: string;
  credentialId: string;
  credentialPublicKey: string;
  attestation: string;
}

export type RegisterResponse = {
  status: string;
  message: string;
};

export type FetchChallenge = (url: string) => Promise<string>;
export type RegisterFetch = (url: string, body: RegisterRequest) => Promise<RegisterResponse>;

export type UseWebauthnRegisterOptions = {
  /**
   * The URL to fetch the challenge.
   */
  urlChallenge?: string;

  /**
   * The URL to register the user.
   */
  urlRegister?: string;

  /**
   * The function to fetch the challenge.
   */
  fetchChallenge?: FetchChallenge;

  /**
   * The function to register the user.
   */
  fetchRegister?: RegisterFetch;
};

export function useWebauthnRegister() {
  const register = async (username: string) => {

    const challenge = await server.webauthn.initiate({ request: 'webauthn.register' });

    const registrationEncoded = await client.webauthn.register({
      username,
      challenge: challenge,
    });

    const registrationDecoded = await server.webauthn.register(registrationEncoded);

    const attestation = registrationDecoded.authenticator.attestation;

    if (attestation) {
      const cborDecode = await getCborDecode();
      const attestationObject = cborDecode(base64.encodeBuffer(attestation));
      console.log({attestationObject});
    }
    
    
  };

  return { register };
}
