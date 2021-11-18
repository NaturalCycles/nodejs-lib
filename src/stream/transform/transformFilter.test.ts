import { Readable } from 'stream'
import { _range } from '@naturalcycles/js-lib'
import { transformFilter, _pipelineToArray } from '../../index'
import { transformFilterSync } from './transformFilter'

test('transformFilter', async () => {
  const items = _range(5)

  let items2 = await _pipelineToArray([
    Readable.from(items),
    transformFilter<number>(n => n % 2 === 0),
  ])

  expect(items2).toEqual([0, 2, 4])

  // reset
  items2 = await _pipelineToArray([
    Readable.from(items),
    transformFilterSync<number>(n => n % 2 === 0),
  ])

  expect(items2).toEqual([0, 2, 4])
})
