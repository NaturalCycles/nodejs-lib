import { TransformTyped } from '../stream.model'

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
