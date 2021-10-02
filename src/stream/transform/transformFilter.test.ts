import { Readable } from 'stream'
import { _range } from '@naturalcycles/js-lib'
import { transformFilter, writablePushToArray, _pipeline } from '../../index'
import { transformFilterSync } from './transformFilter'

test('transformFilter', async () => {
  const items = _range(5)
  let items2: number[] = []

  await _pipeline([
    Readable.from(items),
    transformFilter<number>(n => n % 2 === 0),
    writablePushToArray(items2),
  ])

  expect(items2).toEqual([0, 2, 4])

  // reset
  items2 = []
  await _pipeline([
    Readable.from(items),
    transformFilterSync<number>(n => n % 2 === 0),
    writablePushToArray(items2),
  ])

  expect(items2).toEqual([0, 2, 4])
})
