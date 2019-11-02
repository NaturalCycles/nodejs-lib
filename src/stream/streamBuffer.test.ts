import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from './readableFrom'
import { streamBuffer } from './streamBuffer'
import { streamToArray } from './streamToArray'

test('streamBuffer', async () => {
  const data = _range(1, 6).map(n => ({ id: String(n) }))
  const readable = readableFrom(data)

  const data2 = await streamToArray(readable.pipe(streamBuffer(2)))
  expect(data2).toEqual([[{ id: '1' }, { id: '2' }], [{ id: '3' }, { id: '4' }], [{ id: '5' }]])
})
