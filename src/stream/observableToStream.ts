import { Observable } from 'rxjs'
import { Readable } from 'stream'
import { ReadableTyped } from './stream.model'

export function observableToStream<T>(obs: Observable<T>): ReadableTyped<T> {
  const readable: ReadableTyped<T> = new Readable({
    objectMode: true,
    read() {},
  })

  obs.subscribe({
    next: i => readable.push(i),
    error: err => readable.emit('error', err),
    complete: () => readable.push(null),
  })

  return readable
}
