import { Transform } from 'stream'
import { TransformTyped } from './stream.model'

/**
 * Inspired by `through2`
 */
export function _through<IN = object, OUT = IN>(
  mapper: (chunk: IN) => OUT | Promise<OUT>,
  objectMode = true,
): TransformTyped<IN, OUT> {
  return new Transform({
    objectMode,
    async transform(chunk, _encoding, cb) {
      try {
        const out = await mapper(chunk)
        cb(null, out)
      } catch (err) {
        cb(err)
      }
    },
  })
}
