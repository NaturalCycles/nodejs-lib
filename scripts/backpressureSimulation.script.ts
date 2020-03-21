/*

yarn tsn ./scripts/backpressureSimulation.script.ts

 */

import { pDelay } from '@naturalcycles/js-lib'
import { timer } from 'rxjs'
import { map, take } from 'rxjs/operators'
import {
  Debug,
  observableToStream,
  runScript,
  transformLogProgress,
  writableForEach,
  _pipeline,
} from '../src'

Debug.enable('*')

interface Item {
  id: string
}

// Backpressure is used when processDelay / concurrency > sourceDelay, so it'll cause source read throttling
const sourceCount = 500
const sourceDelay = 100
const processDelay = 300
const concurrency = 2

runScript(async () => {
  // emits: 0, 1, 2, 3 after 100ms each
  const source$ = timer(0, sourceDelay).pipe(
    take(sourceCount),
    map(i => ({ id: String(i) } as Item)),
  )
  const readable = observableToStream(source$)

  await _pipeline([
    readable,
    transformLogProgress({ logEvery: 30 }),
    writableForEach(
      async _item => {
        await pDelay(processDelay)
      },
      {
        concurrency,
      },
    ),
  ])
})
