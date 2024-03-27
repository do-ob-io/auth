import { test, expect } from 'vitest';
import * as asym from './asym.js';
import { decode, sign, verify, TokenError } from './token.js';

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
  exp: dateNumeric('1h'),
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
    ...payload,
    exp: Math.floor(payload.exp / 1000),
    iat: expect.any(Number),
  });
});

test('should create a new json web token and NOT verify it with different private key', async () => {
  const keyPair = await asym.generate('signer');
  const tokenSigned = await sign(payload, keyPair.privateKey);
  const tokenVerified = await verify(tokenSigned);

  expect(tokenVerified).toEqual(TokenError.InvalidSignature);
});

test('should create a new json web token and NOT verify it with different public key', async () => {
  const keyPair = await asym.generate('signer');
  const tokenSigned = await sign(payload);
  const tokenVerified = await verify(tokenSigned, keyPair.publicKey);

  expect(tokenVerified).toEqual(TokenError.InvalidSignature);
});

test('should create a new json web token, decode it, then verify the decoded data', async () => {
  const tokenSigned = await sign(payload);
  const tokenDecoded = await decode(tokenSigned);

  if (!tokenDecoded.payload || !tokenDecoded.raw || !tokenDecoded.signature) {
    expect(tokenDecoded).toBeDefined();
    expect(tokenDecoded.payload).toBeDefined();
    expect(tokenDecoded.raw).toBeDefined();
    expect(tokenDecoded.signature).toBeDefined();
    return;
  }
  const verified = await asym.verify(tokenDecoded.raw, tokenDecoded.signature);
  expect(verified).toBe(true);
});
