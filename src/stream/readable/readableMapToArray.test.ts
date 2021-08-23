import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from '../../index'
import { readableMapToArray } from './readableMapToArray'

test('readableMapToArray', async () => {
  const items = _range(5)
  const readable = readableFrom(items)
  const array = await readableMapToArray(readable, n => n * 2)
  expect(array).toEqual(items.map(n => n * 2))
})
