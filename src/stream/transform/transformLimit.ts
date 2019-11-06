import { Transform } from 'stream'
import { TransformOpt, TransformTyped } from '../stream.model'

/**
 * 0 or falsy value means "no limit"
 */
export function transformLimit<IN>(limit?: number, opt: TransformOpt = {}): TransformTyped<IN, IN> {
  let index = 0
  let ended = false

  return new Transform({
    objectMode: true,
    ...opt,
    transform(this: Transform, chunk: IN, _encoding, cb) {
      index++

      if (!ended) {
        cb(null, chunk) // pass through the item
      }

      if (limit && index === limit) {
        ended = true
        console.log(`transformLimit: limit of ${limit} reached`)
        this.emit('end')
      }
    },
  })
}
