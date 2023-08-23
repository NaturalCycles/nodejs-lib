import crypto from 'node:crypto'
import {
  ALPHABET_ALPHANUMERIC,
  ALPHABET_ALPHANUMERIC_LOWERCASE,
  nanoIdCustomAlphabet,
} from './nanoid'

/**
 * Generate cryptographically-secure string id.
 * Powered by `nanoid`.
 */
export function stringId(length = 16, alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE): string {
  return nanoIdCustomAlphabet(alphabet, length)()
}

/**
 * Generate a string id of Base62 alphabet (same as "alphanumeric": A-Za-z0-9)
 *
 * Length is 16 (non-configurable currently).
 */
export const stringIdBase62: () => string = nanoIdCustomAlphabet(ALPHABET_ALPHANUMERIC, 16)

/**
 * Generate a string id of Base64 alphabet: A-Za-z0-9+/
 *
 * Default length is 16.
 * Length should be dividable by 4 (otherwise unexpected length will be produced).
 *
 * Dividable by 4 lengths produce ids with no padding `=` characters, which is optimal.
 */
export function stringIdBase64(size = 16): string {
  return crypto.randomBytes(size * 0.75).toString('base64')
}

/**
 * Generate a string id of Base64url alphabet: A-Za-z0-9-_
 *
 * Default length is 16.
 * Length should be dividable by 4 (otherwise unexpected length will be produced).
 *
 * Base64url always produces strings without a padding character `=`, by design.
 */
export function stringIdBase64Url(size = 16): string {
  return crypto.randomBytes(size * 0.75).toString('base64url')
}
