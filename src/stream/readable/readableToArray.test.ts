import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from '../../index'
import { readableToArray } from './readableToArray'

test('readableToArray', async () => {
  const items = _range(5).map(String)
  const readable = readableFrom(items)
  const array = await readableToArray(readable)
  expect(array).toEqual(items)
})
