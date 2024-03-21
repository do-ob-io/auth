import { token } from '@do-ob/crypto/encrypt';

/**
 * German: Germany
 * 
 * Token error messages.
 */
export const TokenErrorMessages = {
  [token.TokenError.InvalidFormat]: 'Token ist nicht korrekt formatiert',
  [token.TokenError.InvalidHeader]: 'Token-Header ist nicht gültig',
  [token.TokenError.InvalidPayload]: 'Token-Payload ist nicht gültig',
  [token.TokenError.InvalidSignature]: 'Token-Signatur ist nicht gültig',
  [token.TokenError.Expired]: 'Token ist abgelaufen',
  [token.TokenError.CantParse]: 'Token konnte nicht geparst werden',
};
