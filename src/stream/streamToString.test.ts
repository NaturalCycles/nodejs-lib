import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from './readableFrom'
import { streamToString } from './streamToString'

test('streamToString', async () => {
  const data: string[] = _range(1, 4).map(n => String(n))
  const readable = readableFrom(data, false)

  const out = await streamToString(readable, '_')
  // console.log(out)
  expect(out).toBe(data.join('_'))
})
