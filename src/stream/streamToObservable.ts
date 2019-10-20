import { SimpleMovingAverage } from '@naturalcycles/js-lib'
import { since } from '@naturalcycles/time-lib'
import { Observable, Subject } from 'rxjs'
import * as through2Concurrent from 'through2-concurrent'
import { inspect } from 'util'
import { Debug, mb } from '..'
import { ReadableTyped } from './stream.model'

export type StreamMapper<IN, OUT> = (input: IN, index: number) => OUT | PromiseLike<OUT>

export interface StreamToObservableOptions<IN, OUT> {
  /**
   * If NOT defined - will default to "pass through mapper", will set `collectResults=true`, will push each stream item
   * to the returning Observable.
   *
   * If defined - will pass each item through it, allowing to "map" it to another value.
   * `collectResults` will default to `false`, so, if you need to pass results through you need to set it to `true.
   * Otherwise `mapper` function has a `forEach` semantics (not `map` semantics).
   *
   * @default to "pass through mapper".
   */
  mapper?: StreamMapper<IN, OUT>

  /**
   * If true - it will emit (push to Observable) results that === `undefined`.
   * If false - will NOT emit them. Will still emit `complete` in the end.
   * @default false
   */
  emitUndefinedResults?: boolean

  /**
   * Number of concurrently pending promises returned by `mapper`.
   *
   * @default 10
   */
  concurrency?: number

  /**
   * If true - will ignore errors, won't emit any results from them. Will still emit `complete` after all input is processed.
   * @default false
   */
  skipErrors?: boolean

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
   * If true - will log progress in a format like:
   * {read: 10, processed: 4, errors: 0, heapUsed: 47, rps:4, rpsTotal: 3}
   */
  logProgress?: boolean

  /**
   * Interval in milliseconds to print progress stats
   * @default 300
   */
  logProgressInterval?: number
}

const log = Debug('nc:nodejs-lib:stream')

const inspectOpt: NodeJS.InspectOptions = {
  colors: true,
  breakLength: 100,
}

/**
 * Like pMap, but for streams.
 * Main feature is concurrency control and convenient Promise interface.
 * Using this allows native stream .pipe() to work and use backpressure.
 *
 * Only works in objectMode (due to through2Concurrent).
 *
 * Concurrency defaults to 10.
 */
export function streamToObservable<IN, OUT = IN>(
  stream: ReadableTyped<IN>,
  opt: StreamToObservableOptions<IN, OUT> = {},
): Observable<OUT> {
  const {
    emitUndefinedResults = false,
    concurrency = 10,
    skipErrors = false,
    logErrors = true,
    onError,
    logProgress = false,
    logProgressInterval = 300,
  } = opt

  // Default to "pass through mapper"
  const mapper: StreamMapper<IN, OUT> = opt.mapper || (item => (item as any) as OUT)

  let index = 0
  let isRejected = false
  let read = 0
  let processed = 0
  let errors = 0
  const started = Date.now()
  let processedLastSecond = 0
  let lastSecondStarted = Date.now()
  const sma = new SimpleMovingAverage(10) // over last 10 seconds
  const interval = logProgress ? setInterval(logStats, logProgressInterval) : undefined

  const subj = new Subject<OUT>()

  stream
    .pipe(
      through2Concurrent.obj(
        {
          maxConcurrency: concurrency,
          // autoDestroy: true,
          final(cb) {
            if (interval) {
              clearInterval(interval)
              logStats(true)
            }
            cb()
            stream.destroy()

            subj.complete()
          },
        },
        async (chunk: IN, _encoding, cb) => {
          read++
          if (isRejected) return cb()

          try {
            const res = await mapper(chunk, index++)
            processedLastSecond++
            processed++
            if (res !== undefined || emitUndefinedResults) subj.next(res)
            cb()
          } catch (err) {
            errors++
            callOnError(err)
            cb()
          }
        },
      ),
    )
    .on('error', err => {
      callOnError(err)
    })

  return subj

  //

  function callOnError(err: Error): void {
    if (skipErrors) {
      if (logErrors) {
        log.error(err)
      }

      if (onError) {
        try {
          onError(err)
        } catch (_ignored) {}
      }
    } else {
      isRejected = true
      clearInterval(interval!)
      stream.destroy()
      subj.error(err)
    }
  }

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
