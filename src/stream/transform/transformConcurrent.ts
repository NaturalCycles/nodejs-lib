import { FlushCallback, TransformFunction } from 'through2'
import { Through2ConcurrentOptions } from 'through2-concurrent'
import * as through2Concurrent from 'through2-concurrent'
import { TransformTyped } from '../stream.model'

/**
 * Wrapper around `through2-concurrent`.
 * objectMode defaults to true
 */
export function transformConcurrent<IN = any>(
  opt: Through2ConcurrentOptions = {},
  transform?: TransformFunction,
  flush?: FlushCallback,
): TransformTyped<IN, IN> {
  if (opt.objectMode === false) {
    return through2Concurrent(opt, transform, flush)
  } else {
    return through2Concurrent.obj(opt, transform, flush)
  }
}
