import { Transform } from 'stream'
import { ErrorMode, Mapper } from '@naturalcycles/js-lib'
import { TransformTyped } from '../stream.model'

export interface TransformMapSimpleOptions {
  /**
   * Only supports THROW_IMMEDIATELY (default) and SUPPRESS.
   *
   * @default ErrorMode.THROW_IMMEDIATELY
   */
  errorMode?: ErrorMode.THROW_IMMEDIATELY | ErrorMode.SUPPRESS
}

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
  opt: TransformMapSimpleOptions = {},
): TransformTyped<IN, OUT> {
  let index = -1
  const { errorMode = ErrorMode.THROW_IMMEDIATELY } = opt

  return new Transform({
    objectMode: true,
    transform(chunk: IN, _encoding, cb) {
      try {
        cb(null, mapper(chunk, ++index))
      } catch (err) {
        console.error(err)

        if (errorMode === ErrorMode.SUPPRESS) {
          cb() // suppress the error
        } else {
          // Emit the error
          cb(err as Error)
        }
      }
    },
  })
}
