import { TEST_ENC_KEY } from '../test/test.cnst'
import {
  decryptObject,
  decryptRandomIVBuffer,
  decryptString,
  encryptObject,
  encryptRandomIVBuffer,
  encryptString,
} from './crypto.util'

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

test('encryptString, decryptString', () => {
  const plain = 'hello!@#123'
  const enc = encryptString(plain, TEST_ENC_KEY)
  const dec = decryptString(enc, TEST_ENC_KEY)
  expect(dec).toStrictEqual(plain)
})

test('encryptString should be deterministic', () => {
  const plain = 'hello!@#123'
  const enc1 = encryptString(plain, TEST_ENC_KEY)
  const enc2 = encryptString(plain, TEST_ENC_KEY)
  expect(enc2).toBe(enc1)
})

test('encryptObject, decryptObject', () => {
  const obj1 = {
    a: 'aaa',
    b: 'bbb',
  }

  const enc = encryptObject(obj1, TEST_ENC_KEY)
  const obj2 = decryptObject(enc, TEST_ENC_KEY)
  expect(obj2).toEqual(obj1)
  // eslint-disable-next-line jest/prefer-equality-matcher
  expect(obj2 === obj1).toBe(false)

  expect(enc).toMatchInlineSnapshot(`
    {
      "a": "wgYkdhDuRgmLSWkpfGGW/A==",
      "b": "5q89bvl+K55gbEWxKWDScA==",
    }
  `)

  // Should be deterministic:
  expect(encryptObject(obj1, TEST_ENC_KEY)).toEqual(enc)
})
