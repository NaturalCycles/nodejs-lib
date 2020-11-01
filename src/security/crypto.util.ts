import * as crypto from 'crypto'
import { md5 } from './hash.util'

// const randomBytes = promisify(crypto.randomBytes)

function aes256Key(secretKeyBase64: string): string {
  // md5 to match aes-256 key length of 32 bytes
  return md5(Buffer.from(secretKeyBase64, 'base64'))
}

export function encryptRandomIVBuffer(
  input: Buffer,
  secretKeyBase64: string,
  algorithm = 'aes-256-cbc',
): Buffer {
  const key = aes256Key(secretKeyBase64)

  // Random iv to achieve non-deterministic encryption (but deterministic decryption)
  // const iv = await randomBytes(16)
  const iv = crypto.randomBytes(16) // use sync method here for speed

  const cipher = crypto.createCipheriv(algorithm, key, iv)

  return Buffer.concat([iv, cipher.update(input), cipher.final()])
}

export function decryptRandomIVBuffer(
  input: Buffer,
  secretKeyBase64: string,
  algorithm = 'aes-256-cbc',
): Buffer {
  const key = aes256Key(secretKeyBase64)

  // iv is first 16 bytes of encrypted buffer, the rest is payload
  const iv = input.slice(0, 16)
  const payload = input.slice(16)

  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  return Buffer.concat([decipher.update(payload), decipher.final()])
}
