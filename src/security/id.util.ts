import nanoidAsyncGenerate = require('nanoid/async/generate')
import nanoidGenerate = require('nanoid/generate')
import nanoidNonSecureGenerate = require('nanoid/non-secure/generate')

export const ALPHABET_NUMBER = '0123456789'
export const ALPHABET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
export const ALPHABET_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const ALPHABET_ALPHANUMERIC_LOWERCASE = [ALPHABET_NUMBER, ALPHABET_LOWERCASE].join('')
export const ALPHABET_ALPHANUMERIC_UPPERCASE = [ALPHABET_NUMBER, ALPHABET_UPPERCASE].join('')
export const ALPHABET_ALPHANUMERIC = [ALPHABET_NUMBER, ALPHABET_LOWERCASE, ALPHABET_UPPERCASE].join(
  '',
)

/**
 * Generate cryptographically-secure string id.
 * Powered by `nanoid`.
 */
export function stringId(length = 16, alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE): string {
  return nanoidGenerate(alphabet, length)
}

export async function stringIdAsync(
  length = 16,
  alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE,
): Promise<string> {
  return await nanoidAsyncGenerate(alphabet, length)
}

export function stringIdUnsafe(length = 16, alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE): string {
  return nanoidNonSecureGenerate(alphabet, length)
}

// re-export nanoid
export const nanoid = require('nanoid')
