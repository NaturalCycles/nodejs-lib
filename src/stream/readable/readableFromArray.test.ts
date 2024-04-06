import { _range, pDelay } from '@naturalcycles/js-lib'
import { readableFromArray } from '../../index'

test('readableFromArray', async () => {
  const items = _range(1, 11)

  const readable = readableFromArray(items, async item => await pDelay(10, item))

  const r = await readable.toArray()

  expect(r).toEqual(items)
})
