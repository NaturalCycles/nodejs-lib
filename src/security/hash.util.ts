import * as crypto from 'node:crypto'
import { Base64String } from '@naturalcycles/js-lib'

export function md5(s: string | Buffer): string {
  return hash(s, 'md5')
}

export function md5AsBase64(s: string | Buffer): Base64String {
  return hashAsBuffer(s, 'md5').toString('base64')
}

export function md5AsBuffer(s: string | Buffer): Buffer {
  return hashAsBuffer(s, 'md5')
}

export function sha256(s: string | Buffer): string {
  return hash(s, 'sha256')
}

export function sha256AsBase64(s: string | Buffer): Base64String {
  return hashAsBuffer(s, 'sha256').toString('base64')
}

export function sha256AsBuffer(s: string | Buffer): Buffer {
  return hashAsBuffer(s, 'sha256')
}

export function hash(s: string | Buffer, algorithm: string): string {
  return crypto.createHash(algorithm).update(s).digest('hex')
}

export function hashAsBuffer(s: string | Buffer, algorithm: string): Buffer {
  return crypto.createHash(algorithm).update(s).digest()
}

export function base64(s: string | Buffer): Base64String {
  return (typeof s === 'string' ? Buffer.from(s) : s).toString('base64')
}

export function base64ToString(strBase64: Base64String): string {
  return Buffer.from(strBase64, 'base64').toString('utf8')
}

export function base64ToBuffer(strBase64: string): Buffer {
  return Buffer.from(strBase64, 'base64')
}

export function stringToBase64(s: string): Base64String {
  return Buffer.from(s, 'utf8').toString('base64')
}

export function bufferToBase64(b: Buffer): Base64String {
  return b.toString('base64')
}
