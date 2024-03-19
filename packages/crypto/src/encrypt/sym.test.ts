import { test, expect } from 'vitest';
import { decrypt, encrypt, generate } from './sym.js';

const data = 'Hello Symmetric Encryption';

test('should symmetrically encrypt data', async () => {
  const encrypted = await encrypt(data);
  expect(typeof encrypted === 'string').toBe(true);
});

test('should produce different encryption values with same data.', async () => {
  const encrypted1 = await encrypt(data);
  const encrypted2 = await encrypt(data);
  expect(encrypted1 === encrypted2).toBe(false);
});

test('should symmetrically encrypt data and decrypt data', async () => {
  const encrypted = await encrypt(data);
  const decrypted = await decrypt(encrypted);

  expect(decrypted).toBe(data);
});

test('should symmetrically encrypt data and NOT decrypt data with different encryption key', async () => {
  const key = await generate();
  const encrypted = await encrypt(data, key);
  const decrypted = await decrypt(encrypted);

  expect(decrypted).toBeUndefined();
});

test('should symmetrically encrypt data and NOT decrypt data with different decryption key', async () => {
  const key = await generate();
  const encrypted = await encrypt(data);
  const decrypted = await decrypt(encrypted, key);

  expect(decrypted).toBeUndefined();
});
