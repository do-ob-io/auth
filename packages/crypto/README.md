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

How to import the cross-platform Web Crypto object.

For documentation on the Web Crypto API, see [MDN Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

```typescript
import { webcrypto } from '@do-ob/crypto';

(async () => {
  const wc = await webcrypto();

  // Use the webcrypto API
})();
```

## Encoding Modules

The library also includes a set of encoding modules that can be used to encode and decode data.

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
```