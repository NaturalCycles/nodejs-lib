import { Writable } from 'stream'
import { TransformOptions, WritableTyped } from '../stream.model'

/**
 * Will push all results to `arr`, will emit nothing in the end.
 */
export function writablePushToArray<IN>(arr: IN[], opt: TransformOptions = {}): WritableTyped<IN> {
  return new Writable({
    objectMode: true,
    ...opt,
    write(chunk: IN, _encoding, cb) {
      arr.push(chunk)
      // callback to signal that we processed input, but not emitting any output
      cb()
    },
  })
}
