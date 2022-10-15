import { Readable } from 'node:stream'
import { AsyncSequence, END, pDelay } from '@naturalcycles/js-lib'
import { _pipeline, writableVoid } from '../..'
import { transformLogProgress } from './transformLogProgress'

test('transformLogProgress', async () => {
  // const readable = readableFromArray(_range(0, 11), i => pDelay(10, i))
  const readable = Readable.from(AsyncSequence.create(1, i => (i === 10 ? END : pDelay(10, i + 1))))

  await _pipeline([
    readable,
    transformLogProgress({
      logEvery: 2,
      peakRSS: true,
      logSizes: true,
      logZippedSizes: true,
      extra: (r, index) => {
        // console.log(r, index)

        if (index % 10 === 0) return {}

        return {
          aaa: index,
        }
      },
    }),
    // transformLogProgress({logProgressInterval: 10}),
    writableVoid(),
  ])
})
