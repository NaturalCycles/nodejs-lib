import { _range } from '@naturalcycles/js-lib'
import { _pipeline, readableFromArray, writablePushToArray } from '../..'
import { transformLimit } from './transformLimit'

test('transformLimit', async () => {
  const data = _range(1, 50).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)

  const arr: any[] = []
  await _pipeline([
    readable,
    // transformTap((r, i) => console.log(i)),
    transformLimit(5),
    writablePushToArray(arr),
  ])

  expect(arr).toEqual(data.slice(0, 5))

  // console.log(arr)
})
