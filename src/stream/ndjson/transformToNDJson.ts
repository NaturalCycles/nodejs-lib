import { Transform } from 'stream'
import { _sortObjectDeep } from '@naturalcycles/js-lib'
import { TransformTyped } from '../stream.model'

export interface TransformToNDJsonOptions {
  /**
   * If true - will throw an error on JSON.parse / stringify error
   *
   * @default true
   */
  strict?: boolean

  /**
   * If true - will run `sortObjectDeep()` on each object to achieve deterministic sort
   *
   * @default false
   */
  sortObjects?: boolean

  /**
   * @default `\n`
   */
  separator?: string

  /**
   * @experimental
   */
  useFlatstr?: boolean
}

/**
 * Transforms objects (objectMode=true) into chunks \n-terminated JSON strings (readableObjectMode=false).
 */
export function transformToNDJson<IN = any>(
  opt: TransformToNDJsonOptions = {},
): TransformTyped<IN, string> {
  const { strict = true, separator = '\n', sortObjects = false, useFlatstr = false } = opt

  return new Transform({
    objectMode: true,
    readableObjectMode: false,
    transform(chunk: IN, _encoding, cb) {
      try {
        if (sortObjects) {
          chunk = _sortObjectDeep(chunk as any)
        }

        if (useFlatstr) {
          cb(null, flatstr(JSON.stringify(chunk) + separator))
        } else {
          cb(null, JSON.stringify(chunk) + separator)
        }
      } catch (err) {
        console.error(err)

        if (strict) {
          cb(err as Error) // emit error
        } else {
          cb() // emit no error, but no result neither
        }
      }
    },
  })
}

/**
 * Based on: https://github.com/davidmarkclements/flatstr/blob/master/index.js
 */
function flatstr(s: any): string {
  // eslint-disable-next-line
  s | 0
  return s
}
