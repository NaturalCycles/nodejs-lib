import { Readable, Transform } from 'stream'
import { CommonLogger } from '@naturalcycles/js-lib'
import { transformNoOp } from '../../index'
import { TransformOptions, TransformTyped } from '../stream.model'

export interface TransformLimitOptions extends TransformOptions {
  /**
   * Nullish value (e.g 0 or undefined) would mean "no limit"
   */
  limit?: number

  /**
   * If provided (recommended!) - it will call readable.destroy() on limit.
   * Without it - it will only stop the downstream consumers, but won't stop
   * the Readable ("source" of the stream).
   * It is almost always crucial to stop the Source too, so, please provide the Readable here!
   */
  readable?: Readable

  /**
   * Please provide it (a Promise that resolves when the Stream is done, e.g finished consuming things)
   * to be able to wait for Consumers before calling `readable.destroy`.
   * Has no effect if `readable` is not provided.
   */
  streamDone?: Promise<void>

  logger?: CommonLogger

  /**
   * Set to true to enable additional debug messages, e.g it'll log
   * when readable still emits values after the limit is reached.
   */
  debug?: boolean
}

/**
 * 0 or falsy value means "no limit"
 */
export function transformLimit<IN>(opt: TransformLimitOptions = {}): TransformTyped<IN, IN> {
  const { logger = console, limit, readable, streamDone, debug } = opt

  if (!limit) {
    // No limit - returning pass-through transform
    return transformNoOp()
  }

  let i = 0 // so we start first chunk with 1
  let ended = false
  return new Transform({
    objectMode: true,
    ...opt,
    transform(this: Transform, chunk, _, cb) {
      i++

      if (i === limit) {
        ended = true
        logger.log(`transformLimit of ${limit} reached`)
        this.push(chunk)
        this.push(null) // this closes the stream, so Writable will receive `end` and won't write anything
        // It doesn't do anything with Readable stream though
        // rd.pause()

        if (!readable) {
          logger.warn(
            `transformLimit readable is not provided, readable stream will not be stopped`,
          )
        } else {
          logger.log(`transformLimit is calling readable.unpipe() to pause the stream`)
          readable.unpipe() // it is expected to pause the stream

          if (!streamDone) {
            logger.log(
              `transformLimit streamDone is not provided, will do readable.destroy right away`,
            )
            readable.destroy()
          } else {
            void streamDone.then(() => {
              logger.log(`transformLimit streamDone, calling readable.destroy()`)
              // rd.push(null) // this does process.exit(0) !!!
              // this.destroy() // this does process.exit(0) !!!
              readable.destroy() // this throws ERR_STREAM_PREMATURE_CLOSE
            })
          }
        }

        cb() // after pause

        // obj.aborted = true // here's how we abort the Readable stream!

        // this.destroy() // does process.exit(0)
        // this.emit('close') // does process.exit(0)
        // this.pause()
        // this.end(new Error('ended!'))
        // this.destroy(new Error('aborting'))
      } else if (!ended) {
        cb(null, chunk)
      } else {
        if (debug) logger.log(`transformLimit.transform after limit`, i)
        // If we ever HANG (don't call cb) - Node will do process.exit(0) to us
        cb() // ended, don't emit anything
      }
    },
  })
}
