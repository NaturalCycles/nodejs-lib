import { base64ToString, md5, md5AsBuffer, stringToBase64 } from './hash.util'

test('md5', () => {
  const plain = 'hello!@#123'
  const m = md5(plain)
  expect(m).toBe('41f871086829ceb41c02d2f99e11ddd0')
})

test('md5Buffer', () => {
  const plain = 'hello!@#123'
  const m = md5AsBuffer(plain)
  expect(m).toMatchInlineSnapshot(`
    Object {
      "data": Array [
        65,
        248,
        113,
        8,
        104,
        41,
        206,
        180,
        28,
        2,
        210,
        249,
        158,
        17,
        221,
        208,
      ],
      "type": "Buffer",
    }
  `)
})

test('base64', () => {
  const plain = 'hello!@#123'
  const enc = stringToBase64(plain)
  expect(enc).toBe('aGVsbG8hQCMxMjM=')
  const dec = base64ToString(enc)
  expect(dec).toBe(plain)
})
