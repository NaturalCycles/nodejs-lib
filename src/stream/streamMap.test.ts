import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from './readableFrom'
import { streamMap } from './streamMap'

interface Item {
  id: string
}

test('streamMap simple', async () => {
  const data = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const items: Item[] = []
  await streamMap<Item>(readable, {
    mapper: item => items.push(item),
  })

  expect(items).toEqual(data)
  expect(readable.destroyed).toBe(true)
})
