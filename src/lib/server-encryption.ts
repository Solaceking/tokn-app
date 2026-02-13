/**
 * Production-grade server-side encryption
 * Uses AES-256-GCM with random IV for each encryption
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits for GCM (recommended)
const TAG_LENGTH = 128; // Authentication tag

/**
 * Get or derive encryption key from environment
 * Key must be 32 bytes (64 hex characters)
 */
function getEncryptionKey(): Uint8Array {
  const keyHex = process.env.ENCRYPTION_KEY;
  
  if (!keyHex) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  
  if (keyHex.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }
  
  // Convert hex to Uint8Array
  const key = new Uint8Array(KEY_LENGTH);
  for (let i = 0; i < 64; i += 2) {
    key[i / 2] = parseInt(keyHex.substring(i, i + 2), 16);
  }
  
  return key;
}

/**
 * Generate a cryptographically secure random IV
 */
function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Convert Uint8Array to base64 string
 */
function toBase64(buffer: Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
function fromBase64(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypt text using AES-256-GCM
 * Returns base64-encoded string with format: iv:ciphertext:tag (all base64)
 */
export async function encrypt(text: string): Promise<string> {
  if (!text) return text;
  
  try {
    const keyData = getEncryptionKey();
    const iv = generateIV();
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: ALGORITHM },
      false,
      ['encrypt']
    );
    
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
        tagLength: TAG_LENGTH,
      },
      cryptoKey,
      data
    );
    
    // Combine IV + ciphertext
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return toBase64(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt text encrypted with encrypt()
 * Expects base64-encoded string with format: iv:ciphertext:tag
 */
export async function decrypt(encryptedBase64: string): Promise<string> {
  if (!encryptedBase64) return encryptedBase64;
  
  try {
    const keyData = getEncryptionKey();
    const combined = fromBase64(encryptedBase64);
    
    // Extract IV and ciphertext
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: ALGORITHM },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
        tagLength: TAG_LENGTH,
      },
      cryptoKey,
      ciphertext
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - key may be incorrect');
  }
}

/**
 * Encrypt a token (alias for encrypt)
 */
export async function encryptToken(token: string): Promise<string> {
  return encrypt(token);
}

/**
 * Decrypt a token (alias for decrypt)
 */
export async function decryptToken(encryptedToken: string): Promise<string> {
  return decrypt(encryptedToken);
}

/**
 * Hash an API key for display purposes (not for storage)
 * Shows first 8 and last 4 characters
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 16) return '••••••••';
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

/**
 * Generate a new encryption key (for setup purposes)
 * Run this once and save the output to ENCRYPTION_KEY
 */
export function generateEncryptionKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(KEY_LENGTH));
  return Array.from(key)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}