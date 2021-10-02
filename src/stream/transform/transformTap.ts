import { Transform } from 'stream'
import { AsyncMapper } from '@naturalcycles/js-lib'
import { TransformOptions, TransformTyped } from '../stream.model'

/**
 * Similar to RxJS `tap` - allows to run a function for each stream item, without affecting the result.
 * Item is passed through to the output.
 *
 * Can also act as a counter, since `index` is passed to `fn`
 */
export function transformTap<IN>(
  fn: AsyncMapper<IN, any>,
  opt: TransformOptions = {},
): TransformTyped<IN, IN> {
  let index = 0

  return new Transform({
    objectMode: true,
    ...opt,
    async transform(chunk: IN, _encoding, cb) {
      // console.log('tap', chunk)

      try {
        await fn(chunk, index++)
      } catch (err) {
        console.error(err)
        // suppressed error
      }

      cb(null, chunk) // pass through the item
    },
  })
}
