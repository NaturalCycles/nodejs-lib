/*

yarn tsn bench/transformMap.bench

 */

import { Readable } from 'node:stream'
import { runBench } from '@naturalcycles/bench-lib'
import { _range } from '@naturalcycles/js-lib'
import { transformMap, writableForEach, _pipeline, runScript, transformMapSync } from '../../src'

const items = _range(1000).map(id => ({
  id,
  even: id % 2 === 0,
}))

const mapper = (item: any): any => ({ ...item, id2: item.id })

runScript(async () => {
  await runBench({
    fns: {
      transformNoMap: async done => {
        const transformed = []

        await _pipeline([
          Readable.from(items),
          writableForEach(item => void transformed.push(item)),
        ])

        done.resolve()
      },
      transformMapSync: async done => {
        const transformed = []

        await _pipeline([
          Readable.from(items),
          transformMapSync(mapper),
          writableForEach(item => void transformed.push(item)),
        ])

        done.resolve()
      },
      transformMapAsync: async done => {
        const transformed = []

        await _pipeline([
          Readable.from(items),
          transformMap(mapper),
          writableForEach(item => void transformed.push(item)),
        ])

        done.resolve()
      },
    },
    // writeSummary: true,
    runs: 2,
  })
})
