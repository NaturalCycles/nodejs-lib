import { TEST_ENC_KEY } from '../test/test.cnst'
import { decryptRandomIVBuffer, encryptRandomIVBuffer } from './crypto.util'

test('testEncKeySize', () => {
  const key = Buffer.from(TEST_ENC_KEY, 'base64')
  expect(key.length).toBe(256)
})

test('encryptBuffer, decryptBuffer', () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc = encryptRandomIVBuffer(plain, TEST_ENC_KEY)
  const dec = decryptRandomIVBuffer(enc, TEST_ENC_KEY)
  const decStr = dec.toString('utf8')
  expect(dec).toStrictEqual(plain)
  expect(decStr).toBe(plainStr)
})

test('encryptBuffer should not be deterministic', () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc1 = encryptRandomIVBuffer(plain, TEST_ENC_KEY)
  const enc2 = encryptRandomIVBuffer(plain, TEST_ENC_KEY)
  expect(enc1).not.toStrictEqual(enc2)
})
