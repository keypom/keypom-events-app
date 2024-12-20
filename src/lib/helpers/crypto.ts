import nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util"; // Import the utilities properly
import { sha256 } from "js-sha256";
import bs58 from "bs58";
import { KeyPair } from "near-api-js";

// Function to generate signature
export function generateSignature(secretKeyStr: string, callerId: string) {
  // Remove the 'ed25519:' prefix if present
  const secretKeyBase58 = secretKeyStr.replace("ed25519:", "");

  // Decode the secret key from base58
  const secretKeyBytes = bs58.decode(secretKeyBase58);

  // Generate key pair from the secret key
  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKeyBytes);

  // Get the public key in base58 format
  const publicKeyBase58 = bs58.encode(keyPair.publicKey);

  // Create the message to sign
  const message = `${callerId},${publicKeyBase58}`;

  // Sign the messa:e
  const messageBytes = new TextEncoder().encode(message);
  const signature = nacl.sign.detached(messageBytes, keyPair.secretKey);

  // Encode the signature as base64
  const signatureBase64 = Buffer.from(signature).toString("base64");

  return {
    signature: signatureBase64,
    publicKey: `ed25519:${publicKeyBase58}`,
  };
}

export function deriveKey(
  userSecretKey: string,
  dropName: string,
  scavengerId?: string,
) {
  const entropyString = scavengerId
    ? `${userSecretKey}${dropName}${scavengerId}`
    : `${userSecretKey}${dropName}`;
  const entropy = naclUtil.decodeUTF8(entropyString);
  const hash = sha256.array(entropy);
  const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(hash.slice(0, 32)));
  const secretKeyBase58 = bs58.encode(keyPair.secretKey);

  const nearKeyPair = KeyPair.fromString(`ed25519:${secretKeyBase58}`);

  return {
    publicKey: nearKeyPair.getPublicKey().toString(),
    secretKey: nearKeyPair.toString(),
  };
}

// Utility function to base64 encode a JSON object
const encodeToBase64 = (jsonObject: Record<string, any>) => {
  const jsonString = JSON.stringify(jsonObject);
  return Buffer.from(jsonString).toString("base64");
};

// Utility function to decode base64 and parse JSON
const decodeAndParseBase64 = (base64String: string) => {
  // Step 1: Decode the base64 string to get the JSON string
  const jsonString = Buffer.from(base64String, "base64").toString("utf-8");

  // Step 2: Parse the JSON string to get back the original object
  const jsonObject = JSON.parse(jsonString);

  // Step 3: Return the parsed object
  return jsonObject;
};

// Helper to decode NEAR base58 ed25519 secret key
function decodeEd25519SecretKey(secretKeyString: string): Uint8Array {
  const keyWithoutPrefix = secretKeyString.replace("ed25519:", "");
  return bs58.decode(keyWithoutPrefix);
}

// Helper Function 1: Convert Ed25519 to X25519
function convertEd25519ToX25519(ed25519SecretKey: Uint8Array): Uint8Array {
  return nacl.sign.keyPair
    .fromSecretKey(ed25519SecretKey)
    .secretKey.subarray(0, 32);
}

// Helper Function 2: Encrypt large data using a symmetric key
function encryptLargeData(message: string, symmetricKey: Uint8Array) {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = naclUtil.decodeUTF8(message); // Use naclUtil here
  const encrypted = nacl.secretbox(messageUint8, nonce, symmetricKey);

  return {
    encryptedMessage: naclUtil.encodeBase64(encrypted), // Use naclUtil here
    nonce: naclUtil.encodeBase64(nonce), // Use naclUtil here
  };
}

// Helper Function 3: Decrypt large data using a symmetric key
function decryptLargeData(
  encryptedMessage: string,
  nonce: string,
  symmetricKey: Uint8Array,
) {
  const encryptedMessageUint8 = naclUtil.decodeBase64(encryptedMessage); // Use naclUtil here
  const nonceUint8 = naclUtil.decodeBase64(nonce); // Use naclUtil here
  const decrypted = nacl.secretbox.open(
    encryptedMessageUint8,
    nonceUint8,
    symmetricKey,
  );

  if (!decrypted) {
    throw new Error("Failed to decrypt the large message");
  }

  return naclUtil.encodeUTF8(decrypted); // Use naclUtil here
}

// Helper Function 4: Encrypt symmetric key with X25519 public key
function encryptSymmetricKey(
  symmetricKey: Uint8Array,
  publicKey: Uint8Array,
  privateKey: Uint8Array,
) {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encryptedKey = nacl.box(symmetricKey, nonce, publicKey, privateKey);

  return {
    encryptedKey: naclUtil.encodeBase64(encryptedKey), // Use naclUtil here
    nonce: naclUtil.encodeBase64(nonce), // Use naclUtil here
  };
}

// Helper Function 5: Decrypt symmetric key using X25519 private key
function decryptSymmetricKey(
  encryptedKey: string,
  nonce: string,
  publicKey: Uint8Array,
  privateKey: Uint8Array,
) {
  const encryptedKeyUint8 = naclUtil.decodeBase64(encryptedKey); // Use naclUtil here
  const nonceUint8 = naclUtil.decodeBase64(nonce); // Use naclUtil here
  const decryptedKey = nacl.box.open(
    encryptedKeyUint8,
    nonceUint8,
    publicKey,
    privateKey,
  );

  if (!decryptedKey) {
    throw new Error("Failed to decrypt the symmetric key");
  }

  return decryptedKey;
}

// Main function: Encrypt large data and store on-chain
function encryptAndStoreData(ed25519Keypair: string, message: string) {
  const ed25519SecretKey = decodeEd25519SecretKey(ed25519Keypair);
  // Convert Ed25519 keypair to X25519 keypair
  const x25519PrivateKey = convertEd25519ToX25519(ed25519SecretKey);
  const x25519PublicKey = nacl.sign.keyPair
    .fromSecretKey(ed25519SecretKey)
    .publicKey.subarray(0, 32);

  // Step 1: Generate a symmetric key
  const symmetricKey = nacl.randomBytes(nacl.secretbox.keyLength);

  // Step 2: Encrypt the large message using the symmetric key
  const encryptedData = encryptLargeData(message, symmetricKey);

  // Step 3: Encrypt the symmetric key using the X25519 public key
  const encryptedSymmetricKey = encryptSymmetricKey(
    symmetricKey,
    x25519PublicKey,
    x25519PrivateKey,
  );

  // Return the JSON that would be stored on-chain
  return JSON.stringify({
    encryptedMessage: encryptedData.encryptedMessage,
    nonce: encryptedData.nonce,
    encryptedSymmetricKey: encryptedSymmetricKey.encryptedKey,
    keyNonce: encryptedSymmetricKey.nonce,
  });
}

// Main function: Decrypt the stored on-chain data
function decryptStoredData(ed25519Keypair: string, storedDataJSON: string) {
  const ed25519SecretKey = decodeEd25519SecretKey(ed25519Keypair);
  // Parse the stored data from on-chain
  const storedData = JSON.parse(storedDataJSON);

  // Convert Ed25519 keypair to X25519 keypair
  const x25519PrivateKey = convertEd25519ToX25519(ed25519SecretKey);
  const x25519PublicKey = nacl.sign.keyPair
    .fromSecretKey(ed25519SecretKey)
    .publicKey.subarray(0, 32);

  // Step 1: Decrypt the symmetric key using the X25519 private key
  const decryptedSymmetricKey = decryptSymmetricKey(
    storedData.encryptedSymmetricKey,
    storedData.keyNonce,
    x25519PublicKey,
    x25519PrivateKey,
  );

  // Step 2: Decrypt the large data using the symmetric key
  const decryptedMessage = decryptLargeData(
    storedData.encryptedMessage,
    storedData.nonce,
    decryptedSymmetricKey,
  );

  return decryptedMessage;
}

export {
  encryptAndStoreData,
  decodeEd25519SecretKey,
  decryptStoredData,
  decodeAndParseBase64,
  encodeToBase64,
};
