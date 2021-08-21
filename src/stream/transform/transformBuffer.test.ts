import { _range } from '@naturalcycles/js-lib'
import { Readable } from 'stream'
import { writablePushToArray, _pipeline } from '../..'
import { transformBuffer } from './transformBuffer'

test('transformBuffer', async () => {
  const data = _range(1, 6).map(n => ({ id: String(n) }))

  const data2: any[] = []

  await _pipeline([
    Readable.from(data),
    transformBuffer({ batchSize: 2 }),
    writablePushToArray(data2),
  ])

  expect(data2).toEqual([[{ id: '1' }, { id: '2' }], [{ id: '3' }, { id: '4' }], [{ id: '5' }]])
})
