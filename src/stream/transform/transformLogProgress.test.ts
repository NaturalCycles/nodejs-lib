import { Readable } from 'node:stream'
import { pDelay } from '@naturalcycles/js-lib'
import { _pipeline, writableVoid } from '../..'
import { transformLogProgress } from './transformLogProgress'

// todo: AsyncIterable2 (or Iterable2.mapAsync) should be implemented in js-lib
async function* rangeItAsync(
  fromIncl: number,
  toExcl: number,
  delay: number,
): AsyncIterable<number> {
  for (let i = fromIncl; i < toExcl; i++) {
    await pDelay(delay)
    yield i
  }
}

test('transformLogProgress', async () => {
  // const readable = readableFromArray(_range(0, 11), i => pDelay(10, i))
  // const readable = Readable.from(AsyncSequence.create(1, i => (i === 10 ? END : pDelay(10, i + 1))))
  const readable = Readable.from(rangeItAsync(1, 11, 10))

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
