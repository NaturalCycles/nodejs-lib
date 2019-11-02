import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'

export interface TransformToNDJsonOptions {
  /**
   * @default true
   * If true - will throw an error on JSON.parse / stringify error
   */
  strict?: boolean

  /**
   * @default `\n`
   */
  separator?: string
}

/**
 * Transforms objects (objectMode=true) into chunks \n-terminated JSON strings (readableObjectMode=false).
 */
export function transformToNDJson<IN = any>(
  opt: TransformToNDJsonOptions = {},
): TransformTyped<IN, string> {
  const { strict = true, separator = '\n' } = opt

  return new Transform({
    objectMode: true,
    readableObjectMode: false,
    transform(chunk: IN, _encoding, cb) {
      try {
        cb(null, JSON.stringify(chunk) + separator)
      } catch (err) {
        if (strict) {
          cb(err) // emit error
        } else {
          cb() // emit no error, but no result neither
        }
      }
    },
  })
}
