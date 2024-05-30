/* eslint-disable @typescript-eslint/no-explicit-any */
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Converts and encoded base64 string to a buffer.
 */
export function encodeBuffer(encoded: string): ArrayBuffer {
  // Convert from Base64URL to Base64
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64.padEnd(base64.length + padLength, '=');

  // Convert to a binary string
  const binary = atob(padded);

  // Convert binary string to buffer
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return buffer;
}

/**
 * Converts a Uint8Array Buffer to a Base64 String.
 */
export const encode = (input: ArrayBuffer | Uint8Array | string, unpad = false): string => {
  let u8: Uint8Array;
  if (typeof input === 'string') {
    u8 = textEncoder.encode(input);
  } else {
    u8 = new Uint8Array(input);
  }
  if (typeof window === 'undefined') {
    const value = Buffer.from(u8).toString('base64');
    const replaced = value.replaceAll('+', '-').replaceAll('/', '_');
    if (unpad) {
      return replaced.replaceAll('=', '');
    }
    return replaced;
  }

  const binString = Array.from(u8, (x) => String.fromCodePoint(x)).join('');
  const value = window.btoa(binString);
  const replaced = value.replaceAll('+', '-').replaceAll('/', '_');
  if (unpad) {
    return replaced.replaceAll('=', '');
  }
  return replaced;
};

/**
 * Converts a Base64 String to a Uint8Array buffer.
 */
export const decode = (str: string): Uint8Array => {
  if (typeof window === 'undefined') {
    const replaced = str.replaceAll('-', '+').replaceAll('_', '/');
    const value = Buffer.from(replaced, 'base64');
    return new Uint8Array(value);
  }

  const replaced = str.replaceAll('-', '+').replaceAll('_', '/');
  const binString = window.atob(replaced);
  return Uint8Array.from(binString, (m) => m.codePointAt(0)!);
};

/**
 * Encodes a JSON object.
 */
export const encodeJson = (json: Record<string, any>): string => {
  const encoded = encode(textEncoder.encode(JSON.stringify(json)), true);
  return encoded;
};

/**
 * Decodes a JSON object.
 */
export const decodeJson = <T = any>(encoded: string): T | undefined => {
  try {
    const json = JSON.parse(textDecoder.decode(decode(encoded)));
    return json as T | undefined;
  } catch (e) {
    console.error('Error when decoding json data.');
    return undefined;
  }
};
