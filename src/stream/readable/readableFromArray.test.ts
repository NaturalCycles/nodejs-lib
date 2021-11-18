import { _range, pDelay } from '@naturalcycles/js-lib'
import { _pipelineToArray, readableFromArray } from '../../index'

test('readableFromArray', async () => {
  const items = _range(1, 11)

  const readable = readableFromArray(items, async item => await pDelay(10, item))

  const r = await _pipelineToArray([readable])

  // jestLog('pipeline done')

  expect(r).toEqual(items)
})
