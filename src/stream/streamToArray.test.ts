import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from './readableFrom'
import { streamToArray } from './streamToArray'

interface Item {
  id: string
}

test('streamToArray obj', async () => {
  const data = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const r = await streamToArray<Item>(readable)
  // console.log(r)
  expect(r).toEqual(data)
  expect(readable.destroyed).toBe(true)
})
