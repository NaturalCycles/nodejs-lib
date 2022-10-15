/*

yarn tsn ndjsonMap.script

 */

import { createWriteStream } from 'node:fs'
import * as fs from 'node:fs'
import { _range } from '@naturalcycles/js-lib'
import { readableFromArray, transformToNDJson, _pipeline } from '../src'
import { runScript } from '../src/script'
import { ndjsonMap } from '../src'
import { tmpDir } from '../src/test/paths.cnst'

runScript(async () => {
  const inputFilePath = `${tmpDir}/ndjsonMapIn.ndjson`
  const outputFilePath = `${tmpDir}/ndjsonMapOut.ndjson`

  if (!fs.existsSync(inputFilePath)) {
    // Create input file
    await _pipeline([
      readableFromArray(_range(1, 101).map(n => ({ id: `id_${n}`, even: n % 2 === 0 }))),
      transformToNDJson(),
      // createGzip(),
      createWriteStream(inputFilePath),
    ])
  }

  await ndjsonMap(mapper, { inputFilePath, outputFilePath })
})

interface Obj {
  id: string
  even?: boolean
}

async function mapper(o: Obj, _index: number): Promise<Obj | undefined> {
  if (o.even) return // filter out evens
  return {
    ...o,
    extra: o.id + '_',
  } as any
}
