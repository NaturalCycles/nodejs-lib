import { Transform } from 'stream'
import { TransformOpt, TransformTyped } from '../stream.model'

/**
 * Similar to RxJS `tap` - allows to run a function for each stream item, without affecting the result.
 * Item is passed through to the output.
 *
 * Can also act as a counter, since `index` is passed to `fn`
 */
export function transformTap<IN>(
  fn: (item: IN, index: number) => any,
  opt: TransformOpt = {},
): TransformTyped<IN, IN> {
  let index = 0

  // return through2.obj( (chunk: IN, _encoding, cb) => {
  //   // try {
  //   //   fn(chunk, index++)
  //   // } catch (err) {
  //   //   console.error(err)
  //   // }
  //   console.log('tap', chunk)
  //
  //   // cb(null, chunk) // pass through the item
  //   cb(null, chunk)
  // }, (cb) => {
  //   console.log('tap flush')
  //   cb()
  // })

  return new Transform({
    objectMode: true,
    ...opt,
    async transform(chunk: IN, _encoding, cb) {
      try {
        await fn(chunk, index++)
      } catch {}
      console.log('tap inside', chunk)

      cb(null, chunk) // pass through the item
      // cb(null) // pass through the item
    },
  })
}
