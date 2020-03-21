import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'

export interface TransformJsonParseOptions {
  /**
   * @default true
   * If true - will throw an error on JSON.parse / stringify error
   */
  strict?: boolean
}

/**
 * Transforms chunks of JSON strings/Buffers (objectMode=false) into parsed objects (readableObjectMode=true).
 *
 * if strict - will throw an error on JSON.parse / stringify error
 *
 * Usage:
 *
 * await _pipeline([
 *   readable,
 *   binarySplit(),
 *   transformJsonParse(),
 *   consumeYourStream...
 * [)
 */
export function transformJsonParse<OUT = object>(
  opt: TransformJsonParseOptions = {},
): TransformTyped<string | Buffer, OUT> {
  const { strict = true } = opt

  return new Transform({
    objectMode: false,
    readableObjectMode: true,
    transform(chunk: string, _encoding, cb) {
      try {
        const data = JSON.parse(chunk)
        cb(null, data)
      } catch (err) {
        // console.error(err)
        if (strict) {
          cb(err) // emit error
        } else {
          cb() // emit no error, but no result neither
        }
      }
    },
  })
}
