import { timer } from 'rxjs'
import { take } from 'rxjs/operators'
import { _pipeline, observableToStream } from '../..'
import { writableVoid } from '../..'
import { transformLogProgress } from './transformLogProgress'

test('transformLogProgress', async () => {
  const source$ = timer(0, 10).pipe(take(21))
  const readable = observableToStream(source$)
  // const readable = readableFromArray(_range(0, 100))

  await _pipeline([
    readable,
    transformLogProgress({ logEvery: 5 }),
    // transformLogProgress({logProgressInterval: 10}),
    writableVoid(),
  ])
})
