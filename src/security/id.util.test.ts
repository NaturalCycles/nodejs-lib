import { _range } from '@naturalcycles/js-lib'
import {
  base62Schema,
  base64Schema,
  base64UrlSchema,
  idBase62Schema,
  idBase64Schema,
  idBase64UrlSchema,
  stringId,
  stringIdBase62,
  stringIdBase64,
  stringIdBase64Url,
  validate,
} from '../index'

const stringIdRegex = /^[a-z0-9]*$/
const base62regex = /^[a-zA-Z0-9]*$/
const base64regex = /^[a-zA-Z0-9+/]*$/
const base64urlRegex = /^[a-zA-Z0-9-_]*$/

test('stringId', () => {
  const id = stringId()
  expect(id.length).toBe(16)
  expect(id.toLowerCase()).toBe(id)

  expect(stringId(32).length).toBe(32)

  _range(100).forEach(() => {
    expect(stringId()).toMatch(stringIdRegex)
  })
})

test('stringIdBase62', () => {
  const id = stringIdBase62()
  expect(id.length).toBe(16)
  expect(id).not.toContain('=')
  expect(id).not.toContain('-')
  expect(id).not.toContain('_')
  expect(id).not.toContain('/')
  expect(id).not.toContain('+')

  _range(100).forEach(() => {
    const id = stringIdBase62()
    expect(id).toMatch(base62regex)
    validate(id, base62Schema)
    validate(id, idBase62Schema)
  })
})

test('stringIdBase64', () => {
  const id = stringIdBase64()
  expect(id.length).toBe(16) // default

  const id2 = stringIdBase64Url()
  expect(id2.length).toBe(16) // default

  const lengths = [4, 8, 12, 16, 32]

  lengths.forEach(len => {
    _range(100).forEach(() => {
      const id = stringIdBase64(len)
      // console.log(id, id.length)
      expect(id.length).toBe(len)
      expect(id).toMatch(base64regex)
      validate(id, base64Schema)
      if (len >= 8) {
        validate(id, idBase64Schema)
      }

      const id2 = stringIdBase64Url(len)
      // console.log(id2, id2.length)
      expect(id2.length).toBe(len)
      expect(id2).toMatch(base64urlRegex)
      validate(id2, base64UrlSchema)

      if (len >= 8) {
        validate(id2, idBase64UrlSchema)
      }
    })
  })
})

test('stringIdBase64Url should have no padding', () => {
  // intentionally using odd sizes
  const lengths = [3, 7, 9, 11, 13]

  lengths.forEach(len => {
    _range(100).forEach(() => {
      const id = stringIdBase64Url(len)
      expect(id).toMatch(base64urlRegex)
    })
  })
})
