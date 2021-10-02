import { Readable, ReadableOptions } from 'stream'
import { AsyncMapper, pMap, _passthroughMapper } from '@naturalcycles/js-lib'
import { ReadableTyped } from '../stream.model'

/**
 * Create Readable from Array.
 * Supports a `mapper` function (async) that you can use to e.g create a timer-emitting-readable.
 *
 * For simple cases use Readable.from(...) (Node.js 12+)
 */
export function readableFromArray<IN, OUT>(
  items: IN[],
  mapper: AsyncMapper<IN, OUT> = _passthroughMapper,
  opt?: ReadableOptions,
): ReadableTyped<OUT> {
  const readable = new Readable({
    objectMode: true,
    ...opt,
    read() {},
  })

  void pMap(
    items,
    async (item, index) => {
      readable.push(await mapper(item, index))
    },
    { concurrency: 1 },
  )
    .then(() => {
      readable.push(null) // done
    })
    .catch(err => {
      console.error(err)
      readable.push(err)
    })

  return readable
}
