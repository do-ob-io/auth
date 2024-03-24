// import React from 'react';
import { random } from '@do-ob/crypto/encode';

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
   * The username to register.
   */
  username: string;

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

export function useWebauthnRegister({
  username,
  // urlChallenge = 'http://localhost:3000/challenge',
  // urlRegister = 'http://localhost:3000/register',
  // fetchChallenge = async (url) => {
  //   const response = await fetch(url);
  //   return await response.text();
  // },
  // fetchRegister = async (url, body) => {
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   });
  //   return await response.text();
  // },
}: UseWebauthnRegisterOptions) {
  const register = async () => {
    const challenge = await random.chars(32);
    const userId = await window.crypto.randomUUID();
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
        rp: {
          id: 'localhost',
          name: 'Local Host',
        },
        user: {
          id: Uint8Array.from(userId, (c) => c.charCodeAt(0)),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          userVerification: 'preferred',
        },
        attestation: 'none',
      }
    });

    console.log(credential);
  };

  return { register };
}
