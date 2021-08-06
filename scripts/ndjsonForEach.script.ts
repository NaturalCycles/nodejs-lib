/*

yarn tsn ndjsonForEach.script

 */

import { ndjsonStreamForEach } from '../src'
import { runScript } from '../src/script'
import { tmpDir } from '../src/test/paths.cnst'

runScript(async () => {
  // File needs to be created first, see ndjsonMap.script.ts
  const inputFilePath = `${tmpDir}/ndjsonMapIn.ndjson`

  let countEvens = 0

  await ndjsonStreamForEach<{ even: boolean }>(
    async r => {
      if (r.even) countEvens++
    },
    {
      inputFilePath,
      logEvery: 10,
      extra: () => ({ countEvens }),
    },
  )

  console.log({ countEvens })
})
