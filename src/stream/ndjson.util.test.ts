import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from '@naturalcycles/nodejs-lib'
import * as fs from 'fs-extra'
import { tmpDir } from '../test/paths.cnst'
import { fromNDJsonStringTransform, toNDJsonStringTransform } from './ndjson.util'
import { _pipeline } from './stream.util'
import { streamToArray } from './streamToArray'
const binarySplit = require('binary-split')

test('ndjson write/read', async () => {
  const items = _range(1, 6).map(num => ({
    k1: `v` + num,
  }))
  const readable = readableFrom(items)

  const outPath = `${tmpDir}/test.jsonl`
  const writable = fs.createWriteStream(outPath)

  await _pipeline([readable, toNDJsonStringTransform(), writable])

  const readable2 = fs
    .createReadStream(outPath)
    .pipe(binarySplit())
    .pipe(fromNDJsonStringTransform())

  const items2 = await streamToArray(readable2)
  expect(items2).toEqual(items)
})
