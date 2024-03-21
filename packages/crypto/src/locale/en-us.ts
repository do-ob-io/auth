import { token } from '@do-ob/crypto/encrypt';

/**
 * English: United States
 * 
 * Token error messages.
 */
export const TokenErrorMessages = {
  [token.TokenError.InvalidFormat]: 'Token is not properly formatted',
  [token.TokenError.InvalidHeader]: 'Token header is not valid',
  [token.TokenError.InvalidPayload]: 'Token payload is not valid',
  [token.TokenError.InvalidSignature]: 'Token signature is not valid',
  [token.TokenError.Expired]: 'Token has expired',
  [token.TokenError.CantParse]: 'Failed to parse token',
};
