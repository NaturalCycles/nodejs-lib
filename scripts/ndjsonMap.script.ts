/*

yarn tsn ndjsonMap.script

 */

import { _range } from '@naturalcycles/js-lib'
import { createWriteStream } from 'fs'
import * as fs from 'fs'
import { readableFromArray, transformToNDJson, _pipeline } from '../src'
import { runScript } from '../src/script'
import { ndjsonMap } from '../src/stream/ndjson/ndjsonMap'
import { testDir, tmpDir } from '../src/test/paths.cnst'

runScript(async () => {
  const inputFilePath = `${tmpDir}/ndjsonMapIn.ndjson`
  const outputFilePath = `${tmpDir}/ndjsonMapOut.ndjson`
  const mapperFilePath = `${testDir}/ndjson/ndjsonMapper.ts`

  if (!fs.existsSync(inputFilePath)) {
    // Create input file
    await _pipeline([
      readableFromArray(_range(1, 101).map(n => ({ id: `id_${n}`, even: n % 2 === 0 }))),
      transformToNDJson(),
      // createGzip(),
      createWriteStream(inputFilePath),
    ])
  }

  await ndjsonMap({ inputFilePath, outputFilePath, mapperFilePath })
})
