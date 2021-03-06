import { Reviver } from '@naturalcycles/js-lib'
import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'

export interface TransformJsonParseOptions {
  /**
   * @default true
   * If true - will throw an error on JSON.parse / stringify error
   */
  strict?: boolean

  reviver?: Reviver
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
export function transformJsonParse<OUT = Record<string, any>>(
  opt: TransformJsonParseOptions = {},
): TransformTyped<string | Buffer, OUT> {
  const { strict = true, reviver } = opt

  return new Transform({
    objectMode: false,
    readableObjectMode: true,
    transform(chunk: string, _encoding, cb) {
      try {
        const data = JSON.parse(chunk, reviver)
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

// Based on: https://stackoverflow.com/a/34557997/4919972
export const bufferReviver: Reviver = (k, v) => {
  if (v !== null && typeof v === 'object' && v.type === 'Buffer' && Array.isArray(v.data)) {
    return Buffer.from(v.data)
  }

  return v
}
