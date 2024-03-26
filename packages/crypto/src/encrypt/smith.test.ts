import { test, expect } from 'vitest';
import * as asym from './asym.ts';
import {
  exporter, importer, unwrap, wrap,
} from './smith.ts';

test('should wrap and unwrap key to verify signature', async () => {
  const data = 'hello world';
  const asymSignerKeys = await asym.generate('signer');

  const wrapped = await wrap(asymSignerKeys.privateKey, 'passwd12');
  const unwrapped = await unwrap(wrapped, 'passwd12');

  if (!unwrapped) {
    expect(unwrapped).toBeDefined();
    return;
  }

  const signature = await asym.sign(data, unwrapped);
  const verify = await asym.verify(data, signature, asymSignerKeys.publicKey);

  expect(verify).toBe(true);
});

test('should wrap and fail to unwrap key with invalid password', async () => {
  const asymSignerKeys = await asym.generate('signer');

  const wrapped = await wrap(asymSignerKeys.privateKey, 'passwd12');
  const unwrapped = await unwrap(wrapped, 'passwd11');

  expect(unwrapped).toBeUndefined();
});

test('should export public key and import it back again to verify signature', async () => {
  const data = 'hello world';
  const asymSignerKeys = await asym.generate('signer');

  const exported = await exporter(asymSignerKeys.publicKey);
  const imported = await importer(exported);

  if (!imported) {
    expect(imported).toBeDefined();
    return;
  }

  const signature = await asym.sign(data, asymSignerKeys.privateKey);
  const verify = await asym.verify(data, signature, imported);

  expect(verify).toBe(true);
});
