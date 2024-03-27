import { test, expect } from 'vitest';
import * as pass from './pass.js';

test('should hash a password', async () => {
  const password = 'MyPassword123';
  const passwordHashed1 = await pass.hash(password);
  const passwordHashed2 = await pass.hash(password);
  expect(passwordHashed1).toBeDefined();
  expect(passwordHashed2).toBeDefined();

  // Two hashes should never be the same with random salting.
  expect(passwordHashed1 === passwordHashed2).toBe(false);
});

test('should hash a password and validate hash value with the original', async () => {
  const password = 'MyPassword123';
  const passwordHashed = await pass.hash(password);
  const result = await pass.compare(password, passwordHashed);

  const length = passwordHashed.length;

  expect(length).toBe(64);
  expect(result).toBe(true);
});

test('should hash a password and NOT validate hash with a different password', async () => {
  const password = 'MyPassword123';
  const passwordHashed = await pass.hash(password);
  const result = await pass.compare('MyPassword12', passwordHashed);

  expect(result).toBe(false);
});
