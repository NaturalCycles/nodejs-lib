import { _range } from '@naturalcycles/js-lib'
import { readableFromArray } from '../readable/readableFromArray'
import { pipelineToArray } from './pipelineToArray'

interface Item {
  id: string
}

test('pipelineToArray', async () => {
  const items: Item[] = _range(1, 6).map(num => ({
    id: `v` + num,
  }))
  const readable = readableFromArray(items)

  const items2 = await pipelineToArray<Item>([readable])
  expect(items2).toEqual(items)
})

test('pipelineToArray objectMode=false', async () => {
  const items = _range(1, 6).map(String)
  const readable = readableFromArray(items)

  const items2 = await pipelineToArray<Buffer>([readable], { objectMode: false })
  expect(items2.map(String)).toEqual(items)
})
