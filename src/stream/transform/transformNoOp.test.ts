import { Readable } from 'stream'
import { _range } from '@naturalcycles/js-lib'
import { _pipeline } from '../pipeline/pipeline'
import { writableVoid } from '../writable/writableVoid'
import { transformMapSimple } from './transformMapSimple'
import { transformNoOp } from './transformNoOp'

test('transformNoOp', async () => {
  const data = _range(1, 4).map(String)
  const readable = Readable.from(data)

  const data2: string[] = []

  await _pipeline([
    readable,
    transformNoOp(),
    transformMapSimple<string, void>(r => void data2.push(r)),
    writableVoid(),
  ])

  expect(data2).toEqual(data)
})
