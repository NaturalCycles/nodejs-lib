import { Mapper } from '@naturalcycles/js-lib'
import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'

/**
 * Simplest version of `transformMap`.
 * errorMode: IMMEDIATE
 * Sync mode.
 * Has 0 options to configure.
 * If you need any configuration - use transformMap or transformMapSync.
 * Sync (not async) version of transformMap.
 * Supposedly faster, for cases when async is not needed.
 */
export function transformMapSimple<IN = any, OUT = IN>(
  mapper: Mapper<IN, OUT>,
): TransformTyped<IN, OUT> {
  let index = 0

  return new Transform({
    objectMode: true,
    transform(chunk: IN, _encoding, cb) {
      try {
        cb(null, mapper(chunk, index++))
      } catch (err) {
        console.error(err)

        // Emit error immediately
        cb(err)
      }
    },
  })
}
