import { Transform } from 'stream'
import { TransformTyped } from './stream.model'

export class StreamBufferTransform<IN = object> extends Transform
  implements TransformTyped<IN, IN[]> {
  buf: IN[] = []

  constructor(batchSize = 10) {
    super({
      objectMode: true,
      transform(this: StreamBufferTransform, chunk, _encoding, cb) {
        this.buf.push(chunk)

        if (this.buf.length >= batchSize) {
          cb(null, this.buf)
          this.buf = []
        } else {
          cb()
        }
      },
      final(this: StreamBufferTransform, cb) {
        if (this.buf.length) {
          this.push(this.buf)
          this.buf = []
        }

        cb()
      },
    })
  }
}

export function streamBuffer<IN = object>(batchSize = 10): TransformTyped<IN, IN[]> {
  return new StreamBufferTransform<IN>(batchSize)
}
