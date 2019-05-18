import { base64ToString, md5, stringToBase64 } from './hash.util'

test('md5', () => {
  const plain = 'hello!@#123'
  const m = md5(plain)
  expect(m).toBe('41f871086829ceb41c02d2f99e11ddd0')
})

test('base64', () => {
  const plain = 'hello!@#123'
  const enc = stringToBase64(plain)
  expect(enc).toBe('aGVsbG8hQCMxMjM=')
  const dec = base64ToString(enc)
  expect(dec).toBe(plain)
})
