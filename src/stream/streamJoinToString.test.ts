import { _range } from '@naturalcycles/js-lib'
import { Readable } from 'stream'
import { streamJoinToString } from './streamJoinToString'

test('streamJoinToString', async () => {
  const data: string[] = _range(1, 4).map(n => String(n))
  const readable = Readable.from(data)

  const out = await streamJoinToString(readable, '_')
  // console.log(out)
  expect(out).toBe(data.join('_'))
})
