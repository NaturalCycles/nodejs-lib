import { Transform } from 'stream'
import { TransformOpt, TransformTyped } from '../stream.model'

/**
 * Will collect all stream results in the array (keeping it in memory) and emit in the end as one result.
 */
export function transformToArray<IN>(opt: TransformOpt = {}): TransformTyped<IN, IN[]> {
  const res: IN[] = []

  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      res.push(chunk)
      // callback to signal that we processed input, but not emitting any output
      cb()
    },
    final(cb) {
      // tslint:disable-next-line:no-invalid-this
      this.push(res)
      cb()
    },
  })
}
