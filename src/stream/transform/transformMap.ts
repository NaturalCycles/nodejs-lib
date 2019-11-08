import { AggregatedError, ErrorMode, Mapper, Predicate } from '@naturalcycles/js-lib'
import * as through2Concurrent from 'through2-concurrent'
import { yellow } from '../..'
import { TransformTyped } from '../stream.model'

export interface TransformMapOptions<OUT = any> {
  /**
   * @default true
   */
  objectMode?: boolean

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
   * Number of concurrently pending promises returned by `mapper`.
   *
   * @default 16 (to match default highWatermark option for objectMode streams)
   */
  concurrency?: number

  /**
   * @default THROW_IMMEDIATELY
   */
  errorMode?: ErrorMode

  /**
   * If defined - will be called on every error happening in the stream.
   * Called BEFORE observable will emit error (unless skipErrors is set to true).
   */
  onError?: (err: Error) => any

  /**
   * Progress metric
   * @default `stream`
   */
  metric?: string
}

function notNullPredicate(item: any): boolean {
  return item !== undefined && item !== null
}

/**
 * Like pMap, but for streams.
 * Inspired by `through2`.
 * Main feature is concurrency control (implemented via `through2-concurrent`) and convenient options.
 * Using this allows native stream .pipe() to work and use backpressure.
 *
 * Only works in objectMode (due to through2Concurrent).
 *
 * Concurrency defaults to 16.
 */
export function transformMap<IN = any, OUT = IN>(
  mapper: Mapper<IN, OUT>,
  opt: TransformMapOptions<OUT> = {},
): TransformTyped<IN, OUT> {
  const {
    concurrency = 16,
    predicate = notNullPredicate,
    errorMode = ErrorMode.THROW_IMMEDIATELY,
    onError,
    metric = 'stream',
  } = opt
  const objectMode = opt.objectMode !== false // default true

  let index = 0
  let isRejected = false
  let errors = 0
  const collectedErrors: Error[] = [] // only used if errorMode == THROW_AGGREGATED

  return (objectMode ? through2Concurrent.obj : through2Concurrent)(
    {
      maxConcurrency: concurrency,
      // autoDestroy: true,
      final(cb) {
        // console.log('final')

        logErrorStats(true)

        if (collectedErrors.length) {
          // emit Aggregated error
          cb(new AggregatedError(collectedErrors))
        } else {
          // emit no error
          cb()
        }
      },
    },
    async (chunk: IN, _encoding, cb) => {
      // console.log({chunk, _encoding})

      // Stop processing if THROW_IMMEDIATELY mode is used
      if (isRejected && errorMode === ErrorMode.THROW_IMMEDIATELY) return cb()

      try {
        const currentIndex = index++ // because we need to pass it to 2 functions - mapper and predicate
        const res = await mapper(chunk, currentIndex)

        if (await predicate(res, currentIndex)) {
          // Tell input stream that we're done processing AND emit result to output
          cb(null, res)
        } else {
          // Tell input stream that we're done processing, but emit nothing to output
          cb()
        }
      } catch (err) {
        console.error(err)

        errors++

        logErrorStats()

        if (onError) {
          try {
            onError(err)
          } catch {}
        }

        if (errorMode === ErrorMode.THROW_IMMEDIATELY) {
          isRejected = true
          // Emit error immediately
          return cb(err)
        }

        if (errorMode === ErrorMode.THROW_AGGREGATED) {
          collectedErrors.push(err)
        }

        // Tell input stream that we're done processing, but emit nothing to output - not error nor result
        cb()
      }
    },
  )

  function logErrorStats(final = false): void {
    if (!errors) return

    console.log(`${metric} ${final ? 'final ' : ''}errors: ${yellow(errors)}`)
  }
}
