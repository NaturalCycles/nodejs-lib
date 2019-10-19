import { AggregatedError } from '@naturalcycles/js-lib'
import { Readable } from 'stream'
import * as through2Concurrent from 'through2-concurrent'

export type StreamMapper<IN, OUT> = (input: IN, index: number) => PromiseLike<OUT>

export interface StreamMapOptions {
  /**
   * If true - it will collect (store in memory) results and return them as array.
   * If false - will return empty array.
   * @default false
   */
  collectResults?: boolean

  /**
   * Number of concurrently pending promises returned by `mapper`.
   *
   * @default 10
   */
  concurrency?: number

  /**
   * When set to `false`, instead of stopping when a promise rejects, it will wait for all the promises to settle and then reject with an Aggregated error.
   *
   * @default true
   */
  stopOnError?: boolean

  /**
   * If true - will ignore errors and return results from successful operations.
   * @default false
   */
  skipErrors?: boolean
}

/**
 * Like pMap, but for streams.
 * Main feature is concurrency control and convenient Promise interface.
 * Using this allows native stream .pipe() to work and use backpressure.
 *
 * Only works in objectMode (due to through2Concurrent)
 */
export async function streamMap<IN = any, OUT = any>(
  stream: Readable,
  mapper: StreamMapper<IN, OUT>,
  opt: StreamMapOptions = {},
): Promise<OUT[]> {
  const { collectResults = false, concurrency = 10, stopOnError = true, skipErrors = false } = opt

  let index = 0
  const results: OUT[] = []
  const errors: Error[] = []
  let isRejected = false

  return new Promise<OUT[]>((resolve, reject) => {
    stream
      .pipe(
        through2Concurrent.obj(
          {
            maxConcurrency: concurrency,
            // autoDestroy: true,
            final(cb) {
              cb()
              stream.destroy()
              if (!stopOnError && !skipErrors && errors.length) {
                return reject(new AggregatedError(errors, results))
              }

              resolve(results)
            },
          },
          async (chunk: IN, _encoding, cb) => {
            if (isRejected) return cb()

            try {
              const res = await mapper(chunk, index++)
              if (collectResults) results.push(res)
              cb()
            } catch (err) {
              if (!stopOnError || skipErrors) {
                errors.push(err)
                cb()
              } else {
                isRejected = true
                // cb(err)
                stream.destroy()
                reject(err)
              }
            }
          },
        ),
      )
      .on('error', err => {
        // console.log('onError', err)
      })
  })
}
