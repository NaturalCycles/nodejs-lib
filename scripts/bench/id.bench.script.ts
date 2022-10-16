/*

yarn tsn bench/id.bench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { stringId, stringIdBase62 } from '../../src'
import { nanoid } from '../../src/security/nanoid'

runBenchScript({
  fns: {
    nanoid: done => {
      const a = nanoid()
      const _b = a.repeat(2)

      done.resolve()
    },
    nanoid16: done => {
      const a = nanoid(16)
      const _b = a.repeat(2)

      done.resolve()
    },
    stringId: done => {
      const a = stringId()
      const _b = a.repeat(2)

      done.resolve()
    },
    stringIdBase62: done => {
      const a = stringIdBase62()
      const _b = a.repeat(2)

      done.resolve()
    },
  },
  runs: 2,
})
