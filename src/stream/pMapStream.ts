import * as through2Concurrent from 'through2-concurrent'

export type MapperFn<T> = (input: T, index: number) => Promise<any>

export interface PMapStreamOptions {
  /**
   * Number of concurrently pending promises returned by `mapper`.
   *
   * @default 10
   */
  concurrency: number

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
 */
export async function pMapStream<T = any>(
  stream: NodeJS.ReadableStream,
  mapper: MapperFn<T>,
  opt: PMapStreamOptions,
): Promise<void> {
  const { concurrency = 10 } = opt
  let index = 0

  return new Promise<void>((resolve, reject) => {
    stream.pipe(
      through2Concurrent.obj(
        {
          maxConcurrency: concurrency,
          final(cb): void {
            cb()
            resolve()
          },
        },
        async (chunk: T, _encoding, cb) => {
          try {
            await mapper(chunk, index++)
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
