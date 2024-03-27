const textEncoder = new TextEncoder();

/**
 * Encodes an ArrayBuffer or Uint8Array Buffer to a Hex String.
 */
export const encode = (input: ArrayBuffer | Uint8Array | string): string => {
  let u8: Uint8Array;
  if (typeof input === 'string') {
    u8 = textEncoder.encode(input);
  } else {
    u8 = new Uint8Array(input);
  }
  const binString = Array.from(u8, (x) => x.toString(16).padStart(2, '0')).join('');
  return binString;
};
