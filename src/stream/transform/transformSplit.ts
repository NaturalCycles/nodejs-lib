import { TransformTyped } from '../stream.model'

// https://github.com/max-mapper/binary-split
// todo: test its newer version that doesn't have `through2` dependency
// todo: test writableHighWaterMark of 64k
const _binarySplit = require('binary-split')

/**
 * Input: stream (objectMode=false) of arbitrary string|Buffer chunks, like when read from fs
 * Output: stream (objectMode=false) or string|Buffer chunks split by `separator` (@default to `\n`)
 *
 * Useful to, for example, reading NDJSON files from fs
 */
export function transformSplit(separator = '\n'): TransformTyped<string | Buffer, string | Buffer> {
  return _binarySplit(separator)
}
