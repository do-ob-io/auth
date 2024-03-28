import {
  RegistrationOptions,
  Registration,
  RegistrationDecoded,
  RegistrationEncoded,
} from './api/registration.ts';

import {
  Authenticator,
  AuthenticatorFlags,
} from './api/authenticator.ts';

import {
  Credential,
  CredentialPublicKeyDecoded,
  CredentialPublicKeyEncoded,
} from './api/credential.ts';

import {
  ClientData,
} from './api/clientData.ts';

import {
  Passkey,
} from './api/passkey.ts';

import {
  Challenge
} from './api/challenge.ts';

export type {
  RegistrationOptions,
  Registration,
  RegistrationDecoded,
  RegistrationEncoded,
  Authenticator,
  AuthenticatorFlags,
  Credential,
  CredentialPublicKeyDecoded,
  CredentialPublicKeyEncoded,
  ClientData,
  Passkey,
  Challenge,
};
