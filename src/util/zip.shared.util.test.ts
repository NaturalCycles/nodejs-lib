import { zipSharedUtil } from './zip.shared.util'

test('zip/unzip', async () => {
  const s = 'abcd1234$%^'

  // String
  let zippedBuf = await zipSharedUtil.zipString(s)
  const unzippedStr = await zipSharedUtil.unzipToString(zippedBuf)
  expect(unzippedStr).toBe(s)

  const sBuf = Buffer.from(s)
  zippedBuf = await zipSharedUtil.zip(sBuf)
  const unzippedBuf = await zipSharedUtil.unzip(zippedBuf)
  expect(unzippedBuf).toEqual(sBuf)
})

test('compatible with java impl', async () => {
  const s = 'aa'
  const zippedBuf = await zipSharedUtil.zipString(s)
  const bytes: number[] = []
  zippedBuf.forEach(c => bytes.push(c))
  // console.log(bytes)
  expect(bytes).toEqual([120, 156, 75, 76, 4, 0, 1, 37, 0, 195])
})
