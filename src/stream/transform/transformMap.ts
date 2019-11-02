import {
  AggregatedError,
  ErrorMode,
  Mapper,
  Predicate,
  SimpleMovingAverage,
} from '@naturalcycles/js-lib'
import { since } from '@naturalcycles/time-lib'
import * as through2Concurrent from 'through2-concurrent'
import { inspect } from 'util'
import { Debug, mb } from '../..'
import { TransformTyped } from '../stream.model'

export interface TransformMapOptions<IN = any, OUT = any> {
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
   * @default true
   */
  logErrors?: boolean

  /**
   * If defined - will be called on every error happening in the stream.
   * Called BEFORE observable will emit error (unless skipErrors is set to true).
   */
  onError?: (err: Error) => any

  /**
   * Interval in milliseconds to print progress stats
   *
   * If defined - will log progress in a format like:
   * {read: 10, processed: 4, errors: 0, heapUsed: 47, rps:4, rpsTotal: 3}
   *
   * @default undefined
   */
  logProgressInterval?: number

  /**
   * Log progress event Nth record that is _processed_ (went through mapper).
   */
  logProgressCount?: number
}

const log = Debug('nc:nodejs-lib:stream')

const inspectOpt: NodeJS.InspectOptions = {
  colors: true,
  breakLength: 100,
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
  opt: TransformMapOptions<IN, OUT> = {},
): TransformTyped<IN, OUT> {
  const {
    concurrency = 16,
    predicate = notNullPredicate,
    errorMode = ErrorMode.THROW_IMMEDIATELY,
    logErrors,
    onError,
    logProgressCount,
    logProgressInterval,
  } = opt
  const objectMode = opt.objectMode !== false // default to true

  let index = 0
  let isRejected = false
  let read = 0
  let processed = 0
  let errors = 0
  const collectedErrors: Error[] = [] // only used if errorMode == THROW_AGGREGATED
  const started = Date.now()
  let processedLastSecond = 0
  let lastSecondStarted = Date.now()
  const sma = new SimpleMovingAverage(10) // over last 10 seconds
  const interval = logProgressInterval ? setInterval(logStats, logProgressInterval) : undefined

  return (objectMode ? through2Concurrent.obj : through2Concurrent)(
    {
      maxConcurrency: concurrency,
      // autoDestroy: true,
      final(cb) {
        // console.log('final')
        if (interval) {
          clearInterval(interval)
          logStats(true)
        }

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
      read++

      // Stop processing if THROW_IMMEDIATELY mode is used
      if (isRejected && errorMode === ErrorMode.THROW_IMMEDIATELY) return cb()

      try {
        const currentIndex = index++ // because we need to pass it to 2 functions - mapper and predicate
        const res = await mapper(chunk, currentIndex)
        processedLastSecond++
        processed++

        if (logProgressCount && processed % logProgressCount === 0) {
          logStats()
        }

        if (await predicate(res, currentIndex)) {
          // Tell input stream that we're done processing AND emit result to output
          cb(null, res)
        } else {
          // Tell input stream that we're done processing, but emit nothing to output
          cb()
        }
      } catch (err) {
        // console.log(err)
        errors++

        if (logErrors) {
          log.error(err)
        }

        if (onError) {
          try {
            onError(err)
          } catch {}
        }

        if (errorMode === ErrorMode.THROW_IMMEDIATELY) {
          isRejected = true
          clearInterval(interval!)
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

  function logStats(final = false): void {
    const now = Date.now()
    const lastRPS = processedLastSecond / ((now - lastSecondStarted) / 1000) || 0
    const rpsTotal = Math.round(processed / ((now - started) / 1000))
    lastSecondStarted = now
    processedLastSecond = 0

    const rps10 = Math.round(sma.push(lastRPS))

    console.log(
      inspect(
        {
          read,
          processed,
          errors,
          heapUsed: mb(process.memoryUsage().heapUsed),
          rps10,
          rpsTotal,
        },
        inspectOpt,
      ),
    )

    if (final) {
      console.log(
        `stream took ${since(started)} to process ${processed} items with total RPS of ${rpsTotal}`,
      )
    }
  }
}
