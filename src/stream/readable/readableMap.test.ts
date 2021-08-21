import { _range } from '@naturalcycles/js-lib'
import { readableToArray } from '../../index'
import { readableFrom } from './readableCreate'
import { readableMap } from './readableMap'

test('readableMap', async () => {
  const items = _range(5).map(String)
  const readable = readableFrom(items)

  const readable2 = readableMap(readable, item => {
    return item + item
  })

  const items2 = await readableToArray(readable2)
  expect(items2).toEqual(items.map(s => s + s))
})
