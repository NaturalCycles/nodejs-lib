import { Transform } from 'stream'
import { TransformOptions, TransformTyped } from '../stream.model'

/**
 * 0 or falsy value means "no limit"
 */
export function transformLimit<IN>(
  limit?: number,
  opt: TransformOptions = {},
): TransformTyped<IN, IN> {
  let index = 0
  let ended = false

  return new Transform({
    objectMode: true,
    ...opt,
    transform(this: Transform, chunk: IN, _encoding, cb) {
      index++

      if (!ended) {
        cb(null, chunk) // pass through the item
      } else {
        cb(null) // pass-through empty
      }

      if (limit && index === limit) {
        ended = true
        console.log(`transformLimit: limit of ${limit} reached`)
        // this.emit('end') // this makes it "halt" on Node 14 lts
      }
    },
  })
}
