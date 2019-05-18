type NanoidGenerate = (alphabet: string, length?: number) => string

const nanoidGenerate = require('nanoid/generate') as NanoidGenerate

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
export function stringId (length = 16, alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE): string {
  return nanoidGenerate(alphabet, length)
}
