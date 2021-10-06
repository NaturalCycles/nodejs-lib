import { pDelay, _range } from '@naturalcycles/js-lib'
import { readableFromArray, _pipeline, writableVoid } from '../..'
import { transformLogProgress } from './transformLogProgress'

test('transformLogProgress', async () => {
  const readable = readableFromArray(_range(0, 11), i => pDelay(10, i))

  await _pipeline([
    readable,
    transformLogProgress({
      logEvery: 2,
      peakRSS: true,
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
