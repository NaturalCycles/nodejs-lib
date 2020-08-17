import {
  AggregatedError,
  AsyncMapper,
  AsyncPredicate,
  ErrorMode,
  pFilter,
} from '@naturalcycles/js-lib'
import { Transform } from 'stream'
import * as through2Concurrent from 'through2-concurrent'
import { yellow } from '../../colors'
import { TransformTyped } from '../stream.model'

export interface TransformMapOptions<IN = any, OUT = IN> {
  /**
   * @default true
   */
  objectMode?: boolean

  /**
   * @default false
   * Set true to support "multiMap" - possibility to return [] and emit 1 result for each item in the array.
   */
  flattenArrayOutput?: boolean

  /**
   * Predicate to filter outgoing results (after mapper).
   * Allows to not emit all results.
   *
   * @default to filter out undefined/null values, but pass anything else
   *
   * Set to `r => r` (passthrough predicate) to pass ANY value (including undefined/null)
   */
  predicate?: AsyncPredicate<OUT>

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
  onError?: (err: Error, input: IN) => any

  /**
   * Progress metric
   * @default `stream`
   */
  metric?: string

  /**
   * If defined - called BEFORE `final()` callback is called.
   */
  beforeFinal?: () => any

  /**
   * If defined - called AFTER final chunk was processed.
   */
  afterFinal?: () => any
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
 *
 * If an Array is returned by `mapper` - it will be flattened and multiple results will be emitted from it. Tested by Array.isArray().
 */
export function transformMap<IN = any, OUT = IN>(
  mapper: AsyncMapper<IN, OUT>,
  opt: TransformMapOptions<IN, OUT> = {},
): TransformTyped<IN, OUT> {
  const {
    concurrency = 16,
    predicate = notNullPredicate,
    errorMode = ErrorMode.THROW_IMMEDIATELY,
    flattenArrayOutput,
    onError,
    beforeFinal,
    afterFinal,
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
      async final(cb) {
        // console.log('transformMap final')

        logErrorStats(true)

        await beforeFinal?.() // call beforeFinal if defined

        if (collectedErrors.length) {
          // emit Aggregated error
          cb(new AggregatedError(collectedErrors))
        } else {
          // emit no error
          cb()
        }

        afterFinal?.() // call afterFinal if defined (optional invokation operator)
      },
    },
    async function transformMapFn(this: Transform, chunk: IN, _encoding: any, cb: Function) {
      // console.log({chunk, _encoding})

      // Stop processing if THROW_IMMEDIATELY mode is used
      if (isRejected && errorMode === ErrorMode.THROW_IMMEDIATELY) return cb()

      try {
        const currentIndex = index++ // because we need to pass it to 2 functions - mapper and predicate. Refers to INPUT index (since it may return multiple outputs)
        const res = await mapper(chunk, currentIndex)
        const passedResults = await pFilter(
          flattenArrayOutput && Array.isArray(res) ? res : [res],
          async r => await predicate(r, currentIndex),
        )

        if (passedResults.length === 0) {
          cb() // 0 results
        } else {
          passedResults.forEach(r => {
            this.push(r)
            // cb(null, r)
          })
          cb() // done processing
        }
      } catch (err) {
        console.error(err)

        errors++

        logErrorStats()

        if (onError) {
          try {
            onError(err, chunk)
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
