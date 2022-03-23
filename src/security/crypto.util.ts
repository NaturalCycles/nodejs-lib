import * as crypto from 'crypto'
import { md5 } from './hash.util'

const algorithm = 'aes-256-cbc'

/**
 * Using aes-256-cbc
 */
export function encryptRandomIVBuffer(input: Buffer, secretKeyBase64: string): Buffer {
  const key = aes256Key(secretKeyBase64)

  // Random iv to achieve non-deterministic encryption (but deterministic decryption)
  // const iv = await randomBytes(16)
  const iv = crypto.randomBytes(16) // use sync method here for speed

  const cipher = crypto.createCipheriv(algorithm, key, iv)

  return Buffer.concat([iv, cipher.update(input), cipher.final()])
}

/**
 * Using aes-256-cbc
 */
export function decryptRandomIVBuffer(input: Buffer, secretKeyBase64: string): Buffer {
  const key = aes256Key(secretKeyBase64)

  // iv is first 16 bytes of encrypted buffer, the rest is payload
  const iv = input.slice(0, 16)
  const payload = input.slice(16)

  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  return Buffer.concat([decipher.update(payload), decipher.final()])
}

/**
 * Using aes-256-cbc
 */
export function decryptString(str: string, secretKey: string): string {
  const { algorithm, key, iv } = getCryptoParams(secretKey)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(str, 'base64', 'utf8')
  return (decrypted += decipher.final('utf8'))
}

/**
 * Using aes-256-cbc
 */
export function encryptString(str: string, secretKey: string): string {
  const { algorithm, key, iv } = getCryptoParams(secretKey)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(str, 'utf8', 'base64')
  return (encrypted += cipher.final('base64'))
}

function getCryptoParams(secretKey: string): { algorithm: string; key: string; iv: string } {
  const key = md5(secretKey)
  const iv = md5(secretKey + key).slice(0, 16)
  return { algorithm, key, iv }
}

function aes256Key(secretKeyBase64: string): string {
  // md5 to match aes-256 key length of 32 bytes
  return md5(Buffer.from(secretKeyBase64, 'base64'))
}
