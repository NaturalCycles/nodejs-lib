import * as through2Concurrent from 'through2-concurrent'

export type PMapStreamMapper<IN, OUT> = (input: IN, index: number) => OUT | PromiseLike<OUT>

export interface PMapStreamOptions {
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
export async function pMapStream<IN = any, OUT = any>(
  stream: NodeJS.ReadableStream,
  mapper: PMapStreamMapper<IN, OUT>,
  opt: PMapStreamOptions = {},
): Promise<OUT[]> {
  const {
    collectResults = false,
    concurrency = 10,
    // stopOnError = true, // todo: implement
  } = opt
  let index = 0
  const results: OUT[] = []

  return new Promise<OUT[]>((resolve, reject) => {
    stream.pipe(
      through2Concurrent.obj(
        {
          maxConcurrency: concurrency,
          final(cb) {
            cb()
            resolve(results)
          },
        },
        async (chunk: IN, _encoding, cb) => {
          try {
            const res = await mapper(chunk, index++)
            if (collectResults) results.push(res)
            cb()
          } catch (err) {
            cb(err)
            reject(err)
          }
        },
      ),
    )
  })
}
