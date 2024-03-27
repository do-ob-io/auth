// import React from 'react';
import { client } from '@do-ob/auth';

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
}: UseWebauthnRegisterOptions) {
  const register = async () => {

    const registration = client.webauthn.register({
      username,
      challenge: 'test',
    });

    console.log({ registration });
    
  };

  return { register };
}
