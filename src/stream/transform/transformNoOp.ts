import { Transform } from 'node:stream'
import { TransformTyped } from '../stream.model'

/**
 * Transform that does nothing (pass the data through).
 * Can be used e.g to convert "not-valid" stream (e.g one that `transformMap` is producing)
 * into a "valid" stream (that implements async-iteration interface).
 */
export function transformNoOp<T = any>(): TransformTyped<T, T> {
  return new Transform({
    objectMode: true,
    transform(chunk: T, _, cb) {
      cb(null, chunk)
    },
  })
}
