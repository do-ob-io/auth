const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');

/**
 * Encodes a string into an ArrayBuffer.
 */
export function encode(input: string): ArrayBuffer {
  return textEncoder.encode(input).buffer;
}

/**
 * Decodes an ArrayBuffer into a string.
 */
export function decode(buffer: ArrayBuffer): string {
  return textDecoder.decode(new Uint8Array(buffer));
}

/**
 * Encodes a JSON object into an ArrayBuffer.
 */
export function encodeJson(json: Record<string, unknown>): ArrayBuffer {
  const encoded = textEncoder.encode(JSON.stringify(json));
  return encoded.buffer;
}

/**
 * Decodes an ArrayBuffer into a JSON object.
 */
export function decodeJson<T = Record<string, unknown>>(buffer: ArrayBuffer): T {
  const decoded = textDecoder.decode(buffer);
  return JSON.parse(decoded);
}
