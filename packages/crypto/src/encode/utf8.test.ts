import { test, expect } from 'vitest';
import * as utf8 from './utf8.ts';

/**
 * Test the encoding of a string to an ArrayBuffer using utf8.encode.
 */
test('utf8.encode', () => {
  expect(utf8.encode('abc')).toEqual(new TextEncoder().encode('abc').buffer);
  expect(utf8.encode('😀')).toEqual(new TextEncoder().encode('😀').buffer);
  expect(utf8.encode('😀abc😀')).toEqual(new TextEncoder().encode('😀abc😀').buffer);
});

/**
 * Test the decoding of an ArrayBuffer to a string using utf8.decode.
 */
test('utf8.decode', () => {
  expect(utf8.decode(new TextEncoder().encode('abc').buffer)).toEqual('abc');
  expect(utf8.decode(new TextEncoder().encode('😀').buffer)).toEqual('😀');
  expect(utf8.decode(new TextEncoder().encode('😀abc😀').buffer)).toEqual('😀abc😀');
});

/**
 * Test the encoding of a JSON object to an ArrayBuffer using utf8.encodeJson.
 */
test('utf8.encodeJson', () => {
  const json = { a: 1, b: '2', c: true };
  const buffer = utf8.encodeJson(json);
  const decoded = utf8.decodeJson(buffer);
  expect(decoded).toEqual(json);
});

/**
 * Test the decoding of an ArrayBuffer to a JSON object using utf8.decodeJson.
 */
test('utf8.decodeJson', () => {
  const json = { a: 1, b: '2', c: true };
  const buffer = utf8.encodeJson(json);
  const decoded = utf8.decodeJson(buffer);
  expect(decoded).toEqual(json);
});
