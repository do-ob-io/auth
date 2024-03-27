let webcryptoInstance: Crypto | undefined;

/**
 * Get the crypto instance for the current environment.
 * 
 * There is no support for React Native yet.
 */
export const webcrypto = async (): Promise<Crypto> => {
  if (!webcryptoInstance) {
    if (typeof window === 'undefined') {
      const c = await import('node:crypto');
      webcryptoInstance = c.webcrypto as Crypto;
    } else {
      webcryptoInstance = window.crypto as Crypto;
    }
  }

  return webcryptoInstance;
};
