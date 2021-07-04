import { _range } from '@naturalcycles/js-lib'
import { Readable } from 'stream'
import { writableVoid, _pipeline } from '../..'
import { transformMapSync } from './transformMapSync'

interface Item {
  id: string
}

test('transformMapSync simple', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))
  const readable = Readable.from(data)

  const data2: Item[] = []

  await _pipeline([readable, transformMapSync<Item, void>(r => void data2.push(r)), writableVoid()])

  expect(data2).toEqual(data)
  // expect(readable.destroyed).toBe(true)
})
