import { test, expect } from 'vitest';
import { hash } from './hash.js';

const dataSample = 'Hello data to hash';

test('should hash data', async () => {
  const hashed = await hash(dataSample);
  expect(typeof hashed === 'string').toBe(true);
});

test('should produce equal hashes for same data', async () => {
  const hashed1 = await hash(dataSample);
  const hashed2 = await hash(dataSample);
  expect(hashed1 === hashed2).toBe(true);
});

test('should produce different hashes for different data', async () => {
  const hashed1 = await hash(dataSample);
  const hashed2 = await hash('Hello different data to hash');
  expect(hashed1 === hashed2).toBe(false);
});
