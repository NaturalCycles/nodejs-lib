import { Transform } from 'stream'
import { TransformOpt, TransformTyped } from '../stream.model'

/**
 * Will push all results to `arr`, will emit nothing in the end.
 */
export function transformPushToArray<IN>(
  arr: IN[],
  opt: TransformOpt = {},
): TransformTyped<IN, void> {
  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      arr.push(chunk)
      // callback to signal that we processed input, but not emitting any output
      cb()
    },
  })
}
