import { ErrorMode, Mapper, Predicate } from '@naturalcycles/js-lib'
import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'
import { notNullishPredicate, TransformMapOptions } from './transformMap'

// todo: not all options are implemented
export interface TransformMapSyncOptions<IN = any, OUT = IN> {
  /**
   * @default true
   */
  objectMode?: boolean

  /**
   * @default false
   * Set true to support "multiMap" - possibility to return [] and emit 1 result for each item in the array.
   */
  flattenArrayOutput?: boolean
  // todo

  /**
   * Predicate to filter outgoing results (after mapper).
   * Allows to not emit all results.
   *
   * @default to filter out undefined/null values, but pass anything else
   *
   * Set to `r => r` (passthrough predicate) to pass ANY value (including undefined/null)
   */
  predicate?: Predicate<OUT>

  /**
   * @default THROW_IMMEDIATELY
   */
  errorMode?: ErrorMode

  /**
   * If defined - will be called on every error happening in the stream.
   * Called BEFORE observable will emit error (unless skipErrors is set to true).
   */
  onError?: (err: Error, input: IN) => any

  /**
   * Progress metric
   *
   * @default `stream`
   */
  metric?: string
}

/**
 * Sync (not async) version of transformMap.
 * Supposedly faster, for cases when async is not needed.
 */
export function transformMapSync<IN = any, OUT = IN>(
  mapper: Mapper<IN, OUT>,
  opt: TransformMapOptions = {},
): TransformTyped<IN, OUT> {
  let index = 0

  const {
    predicate = notNullishPredicate,
    // errorMode = ErrorMode.THROW_IMMEDIATELY,
    // flattenArrayOutput,
    // onError,
    // metric = 'stream',
  } = opt
  const objectMode = opt.objectMode !== false // default true

  return new Transform({
    objectMode,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      try {
        if (!predicate(chunk, index++)) {
          cb() // signal that we've finished processing, but emit no output here
          return
        }

        // map and pass through
        cb(null, mapper(chunk, index))
      } catch (err) {
        // todo: implement error handling
        // console.error(err)
        cb(err)
      }
    },
  })
}
