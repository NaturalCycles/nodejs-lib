import { Readable } from 'node:stream'
import { _range } from '@naturalcycles/js-lib'
import { readableFromArray } from '../..'
import { _pipelineToArray } from '../pipeline/pipeline'
import { transformLimit } from './transformLimit'

test('transformLimit', async () => {
  const data = _range(1, 50).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)

  const arr = await _pipelineToArray([
    readable,
    // transformTap((r, i) => console.log(i)),
    transformLimit({ limit: 5 }),
  ])

  expect(arr).toEqual(data.slice(0, 5))
})

test('transformLimit with readable.destroy', async () => {
  const data = _range(1, 50).map(n => ({ id: String(n) }))
  const sourceReadable = readableFromArray(data)

  const arr = await _pipelineToArray(
    [
      sourceReadable,
      // transformTap((r, i) => console.log(i)),
      transformLimit({ limit: 5, sourceReadable }),
    ],
    { allowClose: true },
  )

  expect(arr).toEqual(data.slice(0, 5))
})

test('using .take', async () => {
  const data = _range(1, 50).map(n => ({ id: String(n) }))
  const readable = Readable.from(data)

  const arr = await readable.take(5).toArray()

  expect(arr).toEqual(data.slice(0, 5))
})
