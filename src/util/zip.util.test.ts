import {
  gunzipBuffer,
  gunzipToString,
  gzipBuffer,
  gzipString,
  unzipBuffer,
  unzipToString,
  zipBuffer,
  zipString,
} from './zip.util'

test('zip/unzip', async () => {
  const s = 'abcd1234$%^'

  // String
  let zippedBuf = await zipString(s)
  const unzippedStr = await unzipToString(zippedBuf)
  expect(unzippedStr).toBe(s)

  const sBuf = Buffer.from(s)
  zippedBuf = await zipBuffer(sBuf)
  const unzippedBuf = await unzipBuffer(zippedBuf)
  expect(unzippedBuf).toEqual(sBuf)
})

test('gzip/gunzip', async () => {
  const s = 'abcd1234$%^'

  // String
  let zippedBuf = await gzipString(s)
  const unzippedStr = await gunzipToString(zippedBuf)
  expect(unzippedStr).toBe(s)

  const sBuf = Buffer.from(s)
  zippedBuf = await gzipBuffer(sBuf)
  const unzippedBuf = await gunzipBuffer(zippedBuf)
  expect(unzippedBuf).toEqual(sBuf)
})

test('compatible with java impl', async () => {
  const s = 'aa'
  const zippedBuf = await zipString(s)
  const bytes: number[] = []
  zippedBuf.forEach(c => bytes.push(c))
  // console.log(bytes)
  expect(bytes).toEqual([120, 156, 75, 76, 4, 0, 1, 37, 0, 195])
})
