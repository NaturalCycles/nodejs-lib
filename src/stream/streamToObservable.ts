import { Observable, Subject } from 'rxjs'
import { Readable } from 'stream'
import * as through2Concurrent from 'through2-concurrent'

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
export function streamToObservable<IN, OUT>(
  stream: Readable,
  opt: StreamToObservableOptions<IN, OUT> = {},
): Observable<OUT> {
  const {
    emitUndefinedResults = false,
    concurrency = 10,
    skipErrors = false,
    logErrors = true,
    onError,
  } = opt

  // Default to "pass through mapper"
  const mapper: StreamMapper<IN, OUT> = opt.mapper || (item => (item as any) as OUT)

  let index = 0
  let isRejected = false

  const subj = new Subject<OUT>()

  stream
    .pipe(
      through2Concurrent.obj(
        {
          maxConcurrency: concurrency,
          // autoDestroy: true,
          final(cb) {
            cb()
            stream.destroy()

            subj.complete()
          },
        },
        async (chunk: IN, _encoding, cb) => {
          if (isRejected) return cb()

          try {
            const res = await mapper(chunk, index++)
            if (res !== undefined || emitUndefinedResults) subj.next(res)
            cb()
          } catch (err) {
            callOnError(err)
            cb()
          }
        },
      ),
    )
    .on('error', err => {
      callOnError(err)
      // console.log('onError', err)
    })

  return subj

  //

  function callOnError(err: Error): void {
    if (skipErrors) {
      if (logErrors) {
        console.error(err)
      }

      if (onError) {
        try {
          onError(err)
        } catch (_ignored) {}
      }
    } else {
      isRejected = true
      stream.destroy()
      subj.error(err)
    }
  }
}
