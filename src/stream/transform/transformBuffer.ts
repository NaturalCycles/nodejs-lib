import { Transform } from 'stream'
import { TransformOpt, TransformTyped } from '../stream.model'

export interface TransformBufferOptions extends TransformOpt {
  /**
   * @default 10
   */
  batchSize?: number
}

/**
 * Similar to RxJS bufferCount()
 *
 * @default batchSize is 10
 */
export function transformBuffer<IN = Record<string, any>>(
  opt: TransformBufferOptions = {},
): TransformTyped<IN, IN[]> {
  const { batchSize = 10 } = opt

  let buf: IN[] = []

  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk, _encoding, cb) {
      buf.push(chunk)

      if (buf.length >= batchSize) {
        cb(null, buf)
        buf = []
      } else {
        cb()
      }
    },
    final(cb) {
      if (buf.length) {
        // tslint:disable-next-line:no-invalid-this
        this.push(buf)
        buf = []
      }

      cb()
    },
  })
}
