<p align="center">
  <img
    width="256"
    src="https://github.com/do-ob-io/shared/blob/main/do-ob-logo-readme.png?raw=true"
    alt="do-ob logo"
  />
</p>

# Cross-Platform Crypto Methods

This library contains of a set of preconfigured and recommended cryptographic methods using native Web Crypto API for simplification. It is tested and designed to be used in both the browser and Node.JS environments.

This package has ZERO dependencies by solely leveraging the environment's native crypto libraries.

## Installation

The package can be installed using npm, yarn or pnpm.

```bash
npm install @do-ob/crypto
```
```bash
yarn add @do-ob/crypto
```
```bash
pnpm add @do-ob/crypto
```

## WebCrypto Usage

Import the cross-platform Web Crypto object.

For documentation on the Web Crypto API, see [MDN Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

```typescript
import { webcrypto } from '@do-ob/crypto';

(async () => {
  const wc = await webcrypto();

  // Use the native webcrypto API
})();
```

## Encoding Modules

The library includes a set of modules that can be used to encode and decode data for transit or other uses.

### Base64

Encode strings to and from base64.

```typescript
import { base64 } from '@do-ob/crypto/encode';

// Encode strings to base64
const encoded = base64.encode('Hello, World!');
/**
 * Or encode a Uint8Array
 * const encoded = base64.encode(new Uint8Array([1, 2, 3, 4, 5]));
 */

// Decode base64 to string
const decoded = base64.decode(encoded);
```

Encode a JSON object to and from base64. JSON encodings are unpadded.

```typescript
import { base64 } from '@do-ob/crypto/encode';

const obj = { hello: 'world' };

// Encode JSON object to base64
const encoded = base64.encodeJson(obj);

// Decode base64 to JSON object
const decoded = base64.decodeJson(encoded);
// decoded = { hello: 'world' }
```

### Random

Generate random base64 encoded string of a given length.

```typescript
import { random } from '@do-ob/crypto/encode';

// Generates an encoded string of 32 characters.
const challenge = random.chars(32);
```

## Encryption Modules

The library includes a set of encryption modules that can be used to encrypt, decrypt, sign, or verify data.

### Hash

Hash data using the default SHA-256.

You can optionally select the following algorithms: `SHA-1` (for non-crypto applications), `SHA-256`, `SHA-384`, or `SHA-512`.

```typescript
import { hash } from '@do-ob/crypto/encrypt';

// Hash a string using SHA-256
const hashed = await hash('Hello, World!');

// Hash a string using SHA-512
const hashed = await hash('Hello, World!', 'SHA-512');
```

### Symmetric Encryption

Encrypt and decrypt data using AES-GCM (256).

```typescript
import { sym } from '@do-ob/crypto/encrypt';

// Generate a new key.
const key = await sym.generate();

/**
 * Encrypt data
 * 
 * If a key is not provided, a singlton key for this runtime instance will be used.
 */
const encrypted = await sym.encrypt('Hello, World!', key);

/**
 * Decrypt data
 * 
 * If a key is not provided, a singlton key for this runtime instance will be used.
 */
const decrypted = await sym.decrypt(encrypted, key);
/**
 * decrypted = 'Hello, World!'
 * 
 * If the data cannot be decrypted, the method will return undefined.
 */
```

### Asymmetric Encryption

Encrypt and decrypt data using RSA-OAEP (4096).

```typescript
import { asym } from '@do-ob/crypto/encrypt';

// Generate a new key pair for encryption and decryption.
const encryptorKeyPair = await asym.generate('encryptor');

/**
 * Encrypt data
 * 
 * If a public key is not provided, a key from the singlton key pair for this runtime instance will be used.
 */
const encrypted = await asym.encrypt('Hello, World!', encryptorKeyPair.publicKey);

/**
 * Decrypt data
 * 
 * If a private key is not provided, a key from the singlton key pair for this runtime instance will be used.
 */
const decrypted = await asym.decrypt(encrypted, encryptorKeyPair.privateKey);
/**
 * decrypted = 'Hello, World!'
 * 
 * If the data cannot be decrypted, the method will return undefined.
 */
```

### Asymmetric Signatures

Sign and verify data using ECDSA + P-256 + SHA-256.

```typescript
import { asym } from '@do-ob/crypto/encrypt';

// Generate a new key pair for signing and verification.
const signerKeyPair = await asym.generate('signer');

/**
 * Sign data
 * 
 * If a private key is not provided, a key from the singlton key pair for this runtime instance will be used.
 */
const signature = await asym.sign('Hello, World!', signerKeyPair.privateKey);

/**
 * Verify data
 * 
 * If a public key is not provided, a key from the singlton key pair for this runtime instance will be used.
 */
const verified = await asym.verify('Hello, World!', signature, signerKeyPair.publicKey);
/**
 * verified = true
 * 
 * If the data cannot be verified, the method will return false.
 */
```

### Key Management

The library includes a key management module that can be used to export or wrap keys.

#### Exporting and Importing Keys

```typescript
import { key } from '@do-ob/crypto/encrypt';

// Generate a new symetric key.
const newSymKey = await sym.generate();
// Generate a new asymetric encryptor key.
const newAsymEncryptorKey = await asym.generate('encryptor');
// Generate a new asymetric signer key.
const newAsymSignerKey = await asym.generate('signer');

// Export the keys, returning a base64 encoded JWK (a string).
const jwkSym = await key.export(newSymKey, 'symEncryptor');
const jwkAsymEncryptor = await key.export(newAsymEncryptorKey, 'asymEncryptor');
const jwkAsymSigner = await key.export(newAsymSignerKey, 'asymSigner');

// Import the keys back into a CryptoKey object.
const importedSymKey = await key.import(jwkSym);
const importedAsymEncryptorKey = await key.import(jwkAsymEncryptor);
const importedAsymSignerKey = await key.import(jwkAsymSigner);
```

#### Wrapping and Unwrapping Keys

```typescript
import { key } from '@do-ob/crypto/encrypt';

// Generate a new symetric key.
const newSymKey = await sym.generate();
// Generate a new asymetric encryptor key.
const newAsymEncryptorKey = await asym.generate('encryptor');
// Generate a new asymetric signer key.
const newAsymSignerKey = await asym.generate('signer');

// Wrap the keys with a password, returning a base64 encoded JWK (a string).
const wrappedSymKey = await key.wrap(newSymKey, 'MyPassword', 'symEncryptor');
const wrappedAsymEncryptorKey = await key.wrap(newAsymEncryptorKey, 'MyPassword', 'asymEncryptor');
const wrappedAsymSignerKey = await key.wrap(newAsymSignerKey, 'MyPassword', 'asymSigner');

// Unwrap the keys with the password.
const unwrappedSymKey = await key.unwrap(wrappedSym, 'MyPassword');
const unwrappedAsymEncryptorKey = await key.unwrap(wrappedAsymEncryptorKey, 'MyPassword');
const unwrappedAsymSignerKey = await key.unwrap(wrappedAsymSignerKey, 'MyPassword');
```

### JWT Tokens

The library includes a module that can be used to create and verify JWT tokens.

```typescript
import { token } from '@do-ob/crypto/encrypt';

// Generate a new asymetric key pair for signing and verification.
const signerKeyPair = await asym.generate('signer');

// Create a numeric date to set the expiration for 30 minutes from now.
const exp = Date.now() + 1800000;

// Create a new JWT token.
const jwt = await token.sign({ hello: 'world', exp }, signerKeyPair.privateKey);

// Verify a JWT token.
const verified = await token.verify(jwt, signerKeyPair.publicKey);
/**
 * verified = { hello: 'world' }
 * 
 * If the token cannot be verified, the method will return an error code.
 */
switch (verified) {
  case token.TokenError.InvalidFormat:
    // Token is poorly formatted.
    break;
  case token.TokenError.InvalidHeader:
    // Token header is invalid.
    break;
  case token.TokenError.InvalidPayload:
    // Token payload is invalid.
    break;
  case token.TokenError.InvalidSignature:
    // Token signature is invalid.
    break;
  case token.TokenError.Expired:
    // Token has expired.
    break;
  case token.TokenError.CantParse:
    // Token's JSON cannot be parsed.
    break;
}

// Can also decode a JWT token without verifying it.
const decoded = token.decode(jwt);
/**
 * decoded = { hello: 'world' }
 * 
 * If the token cannot be decoded, the method will also return token.TokenError error code.
 */
```

### Sessions

The library includes a module that can be used to create and verify session encryptions.

For the web, these sessions should only be stored in a secure HttpOnly cookie.

```typescript
import { session } from '@do-ob/crypto/encrypt';

// Generate a new symetric key.
const newSymKey = await sym.generate();

// Create a numeric date to set the expiration for 1 day from now.
const exp = Date.now() + 86400000;

// Encrypt a new session.
const session = await session.encrypt({ hello: 'world', exp }, newSymKey);

// Decrypt a session.
const decrypted = await session.decrypt(session, newSymKey);

/**
 * decrypted = { hello: 'world' }
 * 
 * If the session cannot be decrypted, the method will return a SessionError.
 */
switch (decrypted) {
  case session.SessionError.DecryptionFailed:
    // Session is could not be decrypted.
    break;
  case session.SessionError.Expired:
    // Session has expired.
    break;
  case session.SessionError.CantParse:
    // Session's JSON cannot be parsed.
    break;
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

## References

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [COSE Header Algorithm Parameters](https://www.iana.org/assignments/cose/cose.xhtml#algorithms)
- [RFC 7515 - JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [RFC 7516 - JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516)
- [RFC 7518 - JSON Web Algorithms (JWA)](https://tools.ietf.org/html/rfc7518)