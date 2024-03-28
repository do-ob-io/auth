import { test, expect } from 'vitest';
import * as local from './local.js';
import { Passkey } from '@do-ob/auth/api';
import * as keychain from '@do-ob/auth/keychain';

test('should create a registration object for a new user', async () => {
  const registration = await local.register({
    username: 'alice',
    challenge: 'test',
    password: 'test',
  });

  /**
   * The registration object should match the expected shape.
   */
  expect(registration).toMatchObject({
    state: 'encoded',
    credential: expect.any(String),
    clientData: expect.any(String),
    authenticator: expect.any(String),
  });
});

test('should create a registration object for a new user with a custom origin', async () => {
  const registration = await local.register({
    username: 'bob',
    challenge: 'test',
    origin: 'https://example.com',
  });

  /**
   * The registration object should match the expected shape.
   */
  expect(registration).toMatchObject({
    state: 'encoded',
    credential: expect.any(String),
    clientData: expect.any(String),
    authenticator: expect.any(String),
  });
});

test('should both passkeys from the platform database', async () => {
  let passkeys: Passkey[];

  if (typeof indexedDB !== 'undefined') {
    passkeys = await keychain.list();
  } else {
    passkeys = await local.memoryDb.getAll();
  }

  /**
   * The passkeys should be an array.
   */
  expect(passkeys).toBeInstanceOf(Array);
  expect(passkeys).toHaveLength(2);

  const alice = passkeys.find((passkey) => passkey.name === 'alice');
  const bob = passkeys.find((passkey) => passkey.name === 'bob');

  /**
   * The passkeys should match the expected shape.
   */
  expect(alice).toMatchObject({
    id: expect.any(String),
    name: 'alice',
    publicKey: expect.any(String),
    privateKey: expect.any(String),
    wrapped: true,
    algorithm: -7,
  });

  expect(bob).toMatchObject({
    id: expect.any(String),
    name: 'bob',
    publicKey: expect.any(String),
    // The private key should be an instance of CryptoKey since it was not wrapped.
    privateKey: expect.any(Object),
    wrapped: false,
    algorithm: -7,
  });
});
