import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from '../..'
import { _pipelineToArray } from '../pipeline/pipeline'
import { transformOffset } from './transformOffset'

test('transformOffset', async () => {
  const data = _range(1, 30).map(n => ({ id: String(n) }))
  const readable = readableFrom(data)

  const arr = await _pipelineToArray([
    readable,
    // transformTap((r, i) => console.log(i)),
    transformOffset({ offset: 10 }),
  ])

  expect(arr).toEqual(data.slice(10))
})
