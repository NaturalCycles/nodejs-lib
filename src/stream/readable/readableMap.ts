import { Transform } from 'node:stream'
import { AbortableAsyncMapper, SKIP } from '@naturalcycles/js-lib'
import { ReadableTyped } from '../stream.model'

export function readableMap<IN, OUT>(
  readable: ReadableTyped<IN>,
  mapper: AbortableAsyncMapper<IN, OUT>,
): ReadableTyped<OUT> {
  let i = -1

  const stream: ReadableTyped<OUT> = readable
    .on('error', err => stream.emit('error', err))
    .pipe(
      new Transform({
        objectMode: true,
        async transform(chunk, _enc, cb) {
          try {
            const r = await mapper(chunk, ++i)
            if (r === SKIP) {
              cb()
            } else {
              // _assert(r !== END, `readableMap END not supported`)
              cb(null, r)
            }
          } catch (err) {
            console.error(err)
            cb(err as Error)
          }
        },
      }),
    )

  return stream
}
