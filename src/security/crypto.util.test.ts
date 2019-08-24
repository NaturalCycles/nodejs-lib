import { TEST_ENC_KEY } from '../test/test.cnst'
import {
  decryptRandomIVBuffer,
  encryptRandomIVBuffer,
  generateSecretKey,
  generateSecretKeyBase64,
} from './crypto.util'

test('generateSecretKeyBase64', async () => {
  const sizeBytes = 256
  const key = await generateSecretKey(sizeBytes)
  expect(key.length).toBe(sizeBytes)

  const keyBase64 = await generateSecretKeyBase64(sizeBytes)
  expect(keyBase64).not.toBeUndefined()
  expect(keyBase64.length).toBeGreaterThan(sizeBytes)
})

test('testEncKeySize', () => {
  const key = Buffer.from(TEST_ENC_KEY, 'base64')
  expect(key.length).toBe(256)
})

test('encryptBuffer, decryptBuffer', async () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc = await encryptRandomIVBuffer(plain, TEST_ENC_KEY)
  const dec = decryptRandomIVBuffer(enc, TEST_ENC_KEY)
  const decStr = dec.toString('utf8')
  expect(dec).toStrictEqual(plain)
  expect(decStr).toBe(plainStr)
})

test('encryptBuffer should not be deterministic', async () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc1 = await encryptRandomIVBuffer(plain, TEST_ENC_KEY)
  const enc2 = await encryptRandomIVBuffer(plain, TEST_ENC_KEY)
  expect(enc1).not.toStrictEqual(enc2)
})
