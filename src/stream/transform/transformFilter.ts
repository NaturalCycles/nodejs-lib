import { Transform } from 'stream'
import { AsyncPredicate, Predicate } from '@naturalcycles/js-lib'
import { TransformOptions, TransformTyped } from '../stream.model'

/**
 * Note, that currently it's NOT concurrent! (concurrency = 1)
 * So, it's recommended to use transformMap instead, that is both concurrent and has
 * filtering feature by default.
 */
export function transformFilter<IN = any>(
  predicate: AsyncPredicate<IN>,
  opt: TransformOptions = {},
): TransformTyped<IN, IN> {
  let index = 0

  return new Transform({
    objectMode: true,
    ...opt,
    async transform(chunk: IN, _encoding, cb) {
      try {
        if (await predicate(chunk, index++)) {
          cb(null, chunk) // pass through
        } else {
          cb() // signal that we've finished processing, but emit no output here
        }
      } catch (err) {
        cb(err as Error)
      }
    },
  })
}

/**
 * Sync version of `transformFilter`
 */
export function transformFilterSync<IN = any>(
  predicate: Predicate<IN>,
  opt: TransformOptions = {},
): TransformTyped<IN, IN> {
  let index = 0

  return new Transform({
    objectMode: true,
    ...opt,
    async transform(chunk: IN, _encoding, cb) {
      try {
        if (predicate(chunk, index++)) {
          cb(null, chunk) // pass through
        } else {
          cb() // signal that we've finished processing, but emit no output here
        }
      } catch (err) {
        cb(err as Error)
      }
    },
  })
}
