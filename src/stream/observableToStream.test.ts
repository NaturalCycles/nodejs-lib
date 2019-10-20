import { _range } from '@naturalcycles/js-lib'
import { timer } from 'rxjs'
import { take, toArray } from 'rxjs/operators'
import { observableToStream } from './observableToStream'
import { streamToObservable } from './streamToObservable'

test('observableToStream', async () => {
  const source$ = timer(0, 10).pipe(take(10))
  const readable = observableToStream(source$)
  const res = await streamToObservable(readable)
    .pipe(toArray())
    .toPromise()
  expect(res).toEqual(_range(0, 10))
})
