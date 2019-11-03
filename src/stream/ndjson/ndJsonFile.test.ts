import { _range } from '@naturalcycles/js-lib'
import { readableFromArray, writablePushToArray } from '../..'
import { tmpDir } from '../../test/paths.cnst'
import { ndJsonFileRead } from './ndJsonFileRead'
import { ndJsonFileWrite } from './ndJsonFileWrite'
import { pipelineFromNDJsonFile } from './pipelineFromNDJsonFile'
import { pipelineToNDJsonFile } from './pipelineToNDJsonFile'
import { streamToNDJsonFile } from './streamToNDJsonFile'

interface Item {
  id: string
}

test('ndjson write/read', async () => {
  const items: Item[] = _range(1, 6).map(num => ({
    id: 'id' + num,
  }))
  const readable = readableFromArray(items)
  const filePath = `${tmpDir}/ndjson/test.jsonl`

  await pipelineToNDJsonFile([readable], { filePath })

  const items2: Item[] = []
  await pipelineFromNDJsonFile([writablePushToArray(items2)], { filePath })

  expect(items2).toEqual(items)
})

test('ndjson write/read gzip', async () => {
  const items: Item[] = _range(1, 6).map(num => ({
    id: 'id' + num,
  }))
  const readable = readableFromArray(items)
  const filePath = `${tmpDir}/ndjson/test.jsonl.gz`

  await streamToNDJsonFile(readable, { filePath, gzip: true })

  const items2: Item[] = []
  await pipelineFromNDJsonFile([writablePushToArray(items2)], { filePath, gzip: true })

  expect(items2).toEqual(items)
})

test('ndjson write/read whole', async () => {
  const items: Item[] = _range(1, 6).map(num => ({
    id: 'id' + num,
  }))
  const filePath = `${tmpDir}/ndjson/test.jsonl`
  await ndJsonFileWrite(items, { filePath })
  const items2 = await ndJsonFileRead<Item>({ filePath })
  expect(items2).toEqual(items)
})
