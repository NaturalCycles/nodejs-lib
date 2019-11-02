import { _range } from '@naturalcycles/js-lib'
import { readableFromArray } from './readable/readableFromArray'
import { streamToString } from './streamToString'

test('pipelineToString', async () => {
  const data: string[] = _range(1, 4).map(n => String(n))
  const readable = readableFromArray(data, false)

  const out = await streamToString(readable, '_')
  // console.log(out)
  expect(out).toBe(data.join('_'))
})
