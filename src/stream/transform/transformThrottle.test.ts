import { Readable } from 'node:stream'
import { _range, ObjectWithId } from '@naturalcycles/js-lib'
import { test } from 'vitest'
import { _pipeline } from '../pipeline/pipeline'
import { writableVoid } from '../writable/writableVoid'
import { transformTap } from './transformTap'
import { transformThrottle } from './transformThrottle'

test('transformThrottle', async () => {
  await _pipeline([
    // super-fast producer
    Readable.from(_range(1, 11).map(id => ({ id: String(id) }))),
    // transformTap(obj => {
    //   console.log('pre', obj)
    // }),
    transformThrottle<ObjectWithId>({
      interval: 1,
      throughput: 3,
      // debug: true,
    }),
    transformTap(obj => {
      console.log('post', obj)
    }),
    writableVoid(),
  ])
}, 20_000)
