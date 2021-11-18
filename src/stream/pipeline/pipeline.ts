import { pipeline } from 'stream'
import { writablePushToArray } from '../../index'

type AnyStream = NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream

// /**
//  * Promisified stream.pipeline()
//  */
// export let _pipeline = promisify(pipeline)
//
// // Workaround https://github.com/nodejs/node/issues/40191
// // todo: remove it when fix is released in 16.x and in AppEngine 16.x
// if (process.version >= 'v16.10') {
//   const { pipeline } = require('stream/promises')
//   _pipeline = ((streams: AnyStream[]) => pipeline(...streams)) as any
// }

export interface PipelineOptions {
  /**
   * Set to true to allow ERR_STREAM_PREMATURE_CLOSE.
   * Required to support graceful close when using transformLimit
   */
  allowClose?: boolean
}

/**
 * Promisified `stream.pipeline`.
 *
 * Supports opt.allowClose, which allows transformLimit to work (to actually stop source Readable)
 * without throwing an error (ERR_STREAM_PREMATURE_CLOSE).
 */
export async function _pipeline(streams: AnyStream[], opt: PipelineOptions = {}): Promise<void> {
  const first = streams[0] as any
  const rest = streams.slice(1) as any

  return new Promise<void>((resolve, reject) => {
    pipeline(first, ...rest, (err: Error) => {
      if (err) {
        if (opt.allowClose && (err as any)?.code === 'ERR_STREAM_PREMATURE_CLOSE') {
          console.log('_pipeline closed (as expected)')
          return resolve()
        }
        // console.log(`_pipeline error`, err)
        return reject(err)
      }

      resolve()
    })
  })
}

/**
 * Convenience function to make _pipeline collect all items at the end of the stream (should be Transform, not Writeable!)
 * and return.
 */
export async function _pipelineToArray<T>(
  streams: AnyStream[],
  opt: PipelineOptions = {},
): Promise<T[]> {
  const a: T[] = []
  await _pipeline([...streams, writablePushToArray(a)], opt)
  return a
}
