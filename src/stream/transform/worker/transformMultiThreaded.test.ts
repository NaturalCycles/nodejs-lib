import { _range } from '@naturalcycles/js-lib'
import { readableFromArray, writablePushToArray, _pipeline } from '../../..'
import { testDir } from '../../../test/paths.cnst'
import { transformMultiThreaded } from './transformMultiThreaded'

test('transformMultiThreaded', async () => {
  const items = _range(1, 12).map(i => ({ id: i }))
  const items2: any[] = []

  const workerFile = `${testDir}/testWorker.ts`

  await _pipeline([
    readableFromArray(items),
    transformMultiThreaded({
      workerFile,
      poolSize: 4,
      workerData: { hello: 'lalala', logEvery: 2 },
    }),
    writablePushToArray(items2),
  ])

  // console.log(items2)
  expect(items2.sort((a, b) => (a.id < b.id ? -1 : 1))).toEqual(items.filter(i => i.id <= 10))
}, 40000)
