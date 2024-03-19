import { expect, test } from 'vitest';
import {
  generate,
  encrypt,
  decrypt,
  sign,
  verify,
} from './asym.js';

const data = 'This is a secret';

test('should generate a key pair', async () => {
  const keyPairEncrypt = await generate('encryptor');
  expect(typeof keyPairEncrypt.privateKey).toBeDefined();
  expect(typeof keyPairEncrypt.publicKey).toBeDefined();

  const keyPairSign = await generate('signer');
  expect(typeof keyPairSign.privateKey).toBeDefined();
  expect(typeof keyPairSign.publicKey).toBeDefined();
});

test('should generate a key pair, encrypt data, and decrypt data', async () => {
  const keyPair = await generate('encryptor');

  const encryption = await encrypt(data, keyPair.publicKey);
  expect(encryption).toBeDefined();

  const decryption = await decrypt(encryption, keyPair.privateKey);
  expect(decryption).toBe(data);
});

test('should generate a key pair, encrypt data, and fail decryption with invalid key', async () => {
  const keyPair = await generate('encryptor');

  const encryption = await encrypt(data);
  expect(encryption).toBeDefined();

  const decryption = await decrypt(encryption, keyPair.privateKey);
  expect(decryption).toBeUndefined();
});

test('should sign data and verify that signarture', async () => {
  const signature = await sign(data);
  const verification = await verify(data, signature);
  expect(verification).toBe(true);
});

test('should sign data and not verify different data', async () => {
  const signature = await sign(data);
  const dataNew = 'this is another secret';
  const verification = await verify(dataNew, signature);
  expect(verification).toBe(false);
});

test('should sign data and not verify different signature', async () => {
  const keyPair = await generate('signer');
  const signatureAnother = await sign(data, keyPair.privateKey);
  const verification = await verify(data, signatureAnother);
  expect(verification).toBe(false);
});
