import { Transform } from 'stream'
import { TransformTyped } from '../index'

const EOL = '\n'

/**
 * Transforms objects (objectMode=true) into chunks \n-terminated JSON strings (readableObjectMode=false).
 *
 * if strict - will throw an error on JSON.parse / stringify error
 */
export function toNDJsonStringTransform<IN = object>(strict = true): TransformTyped<IN, string> {
  return new Transform({
    objectMode: true,
    readableObjectMode: false,
    transform(chunk: IN, _encoding, cb) {
      try {
        cb(null, JSON.stringify(chunk) + EOL)
      } catch (err) {
        if (strict) cb(err)
      }
    },
  })
}

/**
 * Transforms chunks of JSON strings/Buffers (objectMode=false) into parsed objects (readableObjectMode=true).
 *
 * if strict - will throw an error on JSON.parse / stringify error
 *
 * Usage:
 *
 * await stream.pipeline([
 *   readable,
 *   binarySplit(),
 *   fromNDJsonStringTransform(),
 *   consumeYourStream...
 * [)
 */
export function fromNDJsonStringTransform<OUT = object>(
  strict = true,
): TransformTyped<string | Buffer, OUT> {
  return new Transform({
    objectMode: false,
    readableObjectMode: true,
    transform(chunk: string, _encoding, cb) {
      try {
        const data = JSON.parse(chunk)
        cb(null, data)
      } catch (err) {
        // console.error(err)
        if (strict) cb(err)
      }
    },
  })
}
