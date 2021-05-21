import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'

export interface TransformMapMultiOptions {}

/**
 * Like Mapper, but allows to emit multiple (or 0) results by calling a callback function.
 * Error throwing works as normal (just `throw` it).
 */
export type MultiMapper<IN = any, OUT = any> = (
  input: IN,
  index: number,
  cb: (out: OUT) => any,
) => any

export function transformMapMulti<IN = any, OUT = any>(
  mapper: MultiMapper<IN, OUT>,
  _opt: TransformMapMultiOptions = {},
): TransformTyped<IN, OUT> {
  let index = 0

  return new Transform({
    objectMode: true,
    async transform(chunk: IN, _encoding, cb) {
      try {
        await mapper(chunk, index++, out => {
          // tslint:disable-next-line:no-invalid-this
          this.push(out)
        })
        cb() // signal that we've finished processing, but emit no output here
      } catch (err) {
        cb(err)
      }
    },
  })
}
