import { base64 } from '@do-ob/crypto/encode';

export const Auth: Record<string, string> = {
  encoded: base64.encode('auth'),
};
