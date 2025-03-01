import crypto from "crypto";

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.createHash('sha256')
    .update(process.env.CRYPTO_SECRET || 'fallback_secret_key')
    .digest();
const IV_LENGTH = 16;

/**
 * Encrypts a value using AES-256-CBC.
 * @param {any} value - The value to encrypt.
 * @returns {string} - The encrypted string.
 */
export const encryptValue = (value) => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value); // Convert non-strings to JSON
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted value.
 * @param {string} encryptedValue - The encrypted string.
 * @returns {any} - The decrypted value.
 */
export const decryptValue = (encryptedValue) => {
    if (typeof encryptedValue !== 'string' || !encryptedValue.includes(':')) {
        return encryptedValue; // Skip already decrypted values
    }
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
        return JSON.parse(decrypted); // Convert back to original type if possible
    } catch {
        return decrypted; // Return as string if not JSON
    }
}

/**
 * Recursively encrypts each value in an object or array.
 * @param {Object|Array} data - The object or array to encrypt.
 * @returns {Object|Array} - The encrypted object or array.
 */
export const encryptObject = (data) => {
    if (data === null || data === undefined) return data; // Skip null values

    if (Array.isArray(data)) {
        return data.map(item => encryptObject(item)); // Encrypt each element in the array
    } else if (typeof data === 'object') {
        const encryptedObj = {};
        for (const [key, value] of Object.entries(data)) {
            encryptedObj[key] = encryptObject(value); // Recursively encrypt
        }
        return encryptedObj;
    } else {
        return encryptValue(data); // Encrypt primitive values
    }
}

/**
 * Recursively decrypts each value in an object or array.
 * @param {Object|Array} data - The encrypted object or array.
 * @returns {Object|Array} - The decrypted object or array.
 */
export const decryptObject = (data) => {
    if (data === null || data === undefined) return data; // Skip null values

    if (Array.isArray(data)) {
        return data.map(item => decryptObject(item)); // Decrypt each element in the array
    } else if (typeof data === 'object') {
        const decryptedObj = {};
        for (const [key, value] of Object.entries(data)) {
            decryptedObj[key] = decryptObject(value); // Recursively decrypt
        }
        return decryptedObj;
    } else {
        return decryptValue(data); // Decrypt primitive values
    }
}