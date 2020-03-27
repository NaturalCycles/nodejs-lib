import { customAlphabet } from 'nanoid'
import { customAlphabet as customAlphabetAsync } from 'nanoid/async'
import { customAlphabet as customAlphabetNonSecure } from 'nanoid/non-secure'

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
  return customAlphabet(alphabet, length)()
}

export async function stringIdAsync(
  length = 16,
  alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE,
): Promise<string> {
  return await customAlphabetAsync(alphabet, length)()
}

export function stringIdUnsafe(length = 16, alphabet = ALPHABET_ALPHANUMERIC_LOWERCASE): string {
  return customAlphabetNonSecure(alphabet, length)()
}
