import { webcrypto } from '@do-ob/crypto';
import { test, expect } from 'vitest';
import { encrypt, decrypt, SessionError } from './session.js';

/**
 * Create a numeric date value. Needed typically for bearers.
 */
const dateNumeric = (date?: Date | string) => {
  if (typeof date === 'string') {
    const unit = date.slice(-1);
    const value = parseInt(date, 10);
    if (Number.isNaN(value)) {
      return new Date().getTime();
    }
    switch (unit) {
    case 's':
      return new Date(Date.now() + value * 1000).getTime();
    case 'm':
      return new Date(Date.now() + value * 60000).getTime();
    case 'h':
      return new Date(Date.now() + value * 3600000).getTime();
    case 'd':
      return new Date(Date.now() + value * 86400000).getTime();
    default:
      return new Date().getTime();
    }
  }
  return (date?.getTime() ?? new Date().getTime());
};

test('should encrypt a session', async () => {
  const wc = await webcrypto();
  const session = {
    sub: wc.randomUUID(),
    exp: dateNumeric('30m'),
  };

  const sessionEncrypted = await encrypt(session);

  expect(sessionEncrypted).toBeDefined();
  expect(sessionEncrypted).toEqual(expect.any(String));
});

test('should encrypt and decrypt a session', async () => {
  const wc = await webcrypto();
  const session = {
    sub: wc.randomUUID(),
    exp: dateNumeric('30m'),
  };

  const sessionEncrypted = await encrypt(session);
  const sessionDecrypted = await decrypt(sessionEncrypted);

  expect(sessionDecrypted).toBeDefined();
  expect(sessionDecrypted).toMatchObject({
    ...session,
    exp: expect.any(Number),
  });
});

test('should encrypt and not decrypt an expired session', async () => {
  const wc = await webcrypto();
  const session = {
    sub: wc.randomUUID(),
    exp: dateNumeric(),
  };

  const sessionEncrypted = await encrypt(session);
  expect(sessionEncrypted).toBeDefined();
  expect(sessionEncrypted).toEqual(expect.any(String));

  const sessionDecrypted = await decrypt(sessionEncrypted);
  expect(sessionDecrypted).toEqual(SessionError.Expired);
});
