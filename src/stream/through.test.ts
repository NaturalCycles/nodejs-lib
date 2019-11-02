import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from './readableFrom'
import { streamToArray } from './streamToArray'
import { _through } from './through'

interface Item {
  id: string
}

test('_through', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))

  const data2 = await streamToArray(
    readableFrom(data).pipe(_through<Item>(r => ({ ...r, id2: r.id + '_' }))),
  )
  expect(data2).toEqual(data.map(r => ({ ...r, id2: r.id + '_' })))
})
