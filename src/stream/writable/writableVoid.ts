import { Writable } from 'stream'
import { TransformOptions } from '../stream.model'

/**
 * Use as a "null-terminator" of stream.pipeline.
 * It consumes the stream as quickly as possible without doing anything.
 * Put it in the end of your pipeline in case it ends with Transform that needs a consumer.
 */
export function writableVoid(opt?: TransformOptions): Writable {
  return new Writable({
    objectMode: true,
    ...opt,
    write(chunk, _encoding, cb) {
      cb()
    },
  })
}
