import { _range } from '@naturalcycles/js-lib'
import { toArray } from 'rxjs/operators'
import { readableFromArray } from '../..'
import { streamToObservable } from './streamToObservable'

interface Item {
  id: string
}

test('streamToObservable simple', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFromArray(data)

  const res = await streamToObservable(readable)
    .pipe(toArray())
    .toPromise()
  expect(res).toEqual(data)
})

// todo: streamToObservable exception
