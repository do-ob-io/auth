/* eslint-disable @typescript-eslint/no-explicit-any */
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Converts a Uint8Array Buffer to a Base64 String.
 */
export const encode = (input: Uint8Array | string, unpad = false): string => {
  let u8: Uint8Array;
  if (typeof input === 'string') {
    u8 = textEncoder.encode(input);
  } else {
    u8 = input;
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
