import { AsyncMapper } from '@naturalcycles/js-lib'
import { Transform } from 'stream'
import { TransformOpt, TransformTyped } from '../stream.model'

export interface TransformThroughOptions extends TransformOpt {}

/**
 * Like `transformMap`, but lightweight, no concurrency, etc.
 * Inspired by `through2`
 */
export function transformThrough<IN = any, OUT = IN>(
  mapper: AsyncMapper<IN, OUT>,
  opt: TransformThroughOptions = {},
): TransformTyped<IN, OUT> {
  let index = 0

  return new Transform({
    objectMode: true,
    ...opt,
    async transform(chunk: IN, _encoding, cb) {
      try {
        const res = await mapper(chunk, index++)
        cb(null, res)
      } catch (err) {
        console.error(err) // to be sure
        cb(err)
      }
    },
  })
}
