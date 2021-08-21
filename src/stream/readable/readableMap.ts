import { AsyncMapper } from '@naturalcycles/js-lib'
import { readableCreate } from '../../index'
import { ReadableTyped } from '../stream.model'

export function readableMap<IN, OUT>(
  readable: ReadableTyped<IN>,
  mapper: AsyncMapper<IN, OUT>,
): ReadableTyped<OUT> {
  const out = readableCreate<OUT>()

  void (async () => {
    try {
      let index = 0
      for await (const item of readable) {
        const v = await mapper(item, index++)
        out.push(v)
      }

      // We're done
      out.push(null)
    } catch (err) {
      console.error(err)
      out.emit('error', err)
    }
  })()

  return out
}
