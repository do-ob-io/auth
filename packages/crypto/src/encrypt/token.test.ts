import { test, expect } from 'vitest';
import * as asym from './asym.js';
import { decode, sign, verify } from './token.js';

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

const payload = {
  exp: dateNumeric('1h') / 1000,
  msg: 'Hello World',
};

test('should create a new json web token', async () => {
  const tokenSigned = await sign(payload);

  expect(tokenSigned).toBeDefined();

  const [header, body, signature] = tokenSigned.split('.');
  expect(header).toBeDefined();
  expect(body).toBeDefined();
  expect(signature).toBeDefined();
});

test('should create a new json web token and verify it', async () => {
  const tokenSigned = await sign(payload);
  const tokenVerified = await verify(tokenSigned);

  expect(tokenVerified).toBeDefined();
  expect(tokenVerified).toEqual({
    iat: expect.any(Number),
    ...payload,
  });
});

test('should create a new json web token and NOT verify it with different private key', async () => {
  const keyPair = await asym.generate('signer');
  const tokenSigned = await sign(payload, keyPair.privateKey);
  const tokenVerified = await verify(tokenSigned);

  expect(tokenVerified).toBeUndefined();
});

test('should create a new json web token and NOT verify it with different public key', async () => {
  const keyPair = await asym.generate('signer');
  const tokenSigned = await sign(payload);
  const tokenVerified = await verify(tokenSigned, keyPair.publicKey);

  expect(tokenVerified).toBeUndefined();
});

test('should create a new json web token, decode it, then verify the decoded data', async () => {
  const tokenSigned = await sign(payload);
  const [tokenDecoded, tokenRaw, tokenSignature] = await decode(tokenSigned);

  if (!tokenDecoded || !tokenRaw || !tokenSignature) {
    expect(tokenDecoded).toBeDefined();
    expect(tokenRaw).toBeDefined();
    expect(tokenSignature).toBeDefined();
    return;
  }
  const verified = await asym.verify(tokenRaw, tokenSignature);
  expect(verified).toBe(true);
});
