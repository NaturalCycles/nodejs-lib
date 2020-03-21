import { _range } from '@naturalcycles/js-lib'
import { readableFromArray } from '../..'
import { pipelineToArray } from '../pipeline/pipelineToArray'
import { transformBuffer } from './transformBuffer'

test('transformBuffer', async () => {
  const data = _range(1, 6).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)

  const data2 = await pipelineToArray([readable, transformBuffer({ batchSize: 2 })])
  expect(data2).toEqual([[{ id: '1' }, { id: '2' }], [{ id: '3' }, { id: '4' }], [{ id: '5' }]])
})
