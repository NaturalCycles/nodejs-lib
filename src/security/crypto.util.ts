import * as crypto from 'crypto'
import { _stringMapEntries, StringMap } from '@naturalcycles/js-lib'
import { md5 } from './hash.util'

const algorithm = 'aes-256-cbc'

/**
 * Using aes-256-cbc
 */
export function encryptRandomIVBuffer(input: Buffer, secretKeyBase64: string): Buffer {
  // md5 to match aes-256 key length of 32 bytes
  const key = md5(Buffer.from(secretKeyBase64, 'base64'))

  // Random iv to achieve non-deterministic encryption (but deterministic decryption)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  return Buffer.concat([iv, cipher.update(input), cipher.final()])
}

/**
 * Using aes-256-cbc
 */
export function decryptRandomIVBuffer(input: Buffer, secretKeyBase64: string): Buffer {
  // md5 to match aes-256 key length of 32 bytes
  const key = md5(Buffer.from(secretKeyBase64, 'base64'))

  // iv is first 16 bytes of encrypted buffer, the rest is payload
  const iv = input.slice(0, 16)
  const payload = input.slice(16)

  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  return Buffer.concat([decipher.update(payload), decipher.final()])
}

/**
 * Decrypts all object values.
 * Returns object with decrypted values.
 */
export function decryptObject(obj: StringMap, secretKey: string): StringMap {
  const { key, iv } = getCryptoParams(secretKey)

  const r: StringMap = {}
  _stringMapEntries(obj).forEach(([k, v]) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    r[k] = decipher.update(v, 'base64', 'utf8') + decipher.final('utf8')
  })
  return r
}

export function encryptObject(obj: StringMap, secretKey: string): StringMap {
  const { key, iv } = getCryptoParams(secretKey)

  const r: StringMap = {}
  _stringMapEntries(obj).forEach(([k, v]) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    r[k] = cipher.update(v, 'utf8', 'base64') + cipher.final('base64')
  })
  return r
}

/**
 * Using aes-256-cbc
 */
export function decryptString(str: string, secretKey: string): string {
  const { key, iv } = getCryptoParams(secretKey)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  return decipher.update(str, 'base64', 'utf8') + decipher.final('utf8')
}

/**
 * Using aes-256-cbc
 */
export function encryptString(str: string, secretKey: string): string {
  const { key, iv } = getCryptoParams(secretKey)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  return cipher.update(str, 'utf8', 'base64') + cipher.final('base64')
}

function getCryptoParams(secretKey: string): { key: string; iv: string } {
  const key = md5(secretKey)
  const iv = md5(secretKey + key).slice(0, 16)
  return { key, iv }
}
