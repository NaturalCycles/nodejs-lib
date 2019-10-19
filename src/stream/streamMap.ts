import { AggregatedError } from '@naturalcycles/js-lib'
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
}

/**
 * Like pMap, but for streams.
 * Main feature is concurrency control and convenient Promise interface.
 * Using this allows native stream .pipe() to work and use backpressure.
 *
 * Only works in objectMode (due to through2Concurrent)
 */
export async function streamMap<IN = any, OUT = any>(
  stream: NodeJS.ReadableStream,
  mapper: StreamMapper<IN, OUT>,
  opt: StreamMapOptions = {},
): Promise<OUT[]> {
  const { collectResults = false, concurrency = 10, stopOnError = true } = opt
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
            final(cb) {
              if (!stopOnError && errors.length) {
                reject(new AggregatedError(errors, results))
              } else {
                resolve(results)
              }
              cb()
            },
          },
          async (chunk: IN, _encoding, cb) => {
            if (isRejected) return cb()

            try {
              const res = await mapper(chunk, index++)
              if (collectResults) results.push(res)
              cb()
            } catch (err) {
              if (stopOnError) {
                isRejected = true
                cb(err)
                reject(err)
              } else {
                errors.push(err)
                cb()
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
