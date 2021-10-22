import * as crypto from 'crypto'

export function md5(s: string | Buffer): string {
  return hash(s, 'md5')
}

export function md5AsBuffer(s: string | Buffer): Buffer {
  return hashAsBuffer(s, 'md5')
}

export function hash(s: string | Buffer, algorithm: string): string {
  return crypto.createHash(algorithm).update(s).digest('hex')
}

export function hashAsBuffer(s: string | Buffer, algorithm: string): Buffer {
  return crypto.createHash(algorithm).update(s).digest()
}

export function stringToBase64(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64')
}

export function base64ToString(strBase64: string): string {
  return Buffer.from(strBase64, 'base64').toString('utf8')
}

export function bufferToBase64(b: Buffer): string {
  return b.toString('base64')
}

export function base64ToBuffer(strBase64: string): Buffer {
  return Buffer.from(strBase64, 'base64')
}
