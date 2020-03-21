import { Readable } from 'stream'
import { ReadableTyped } from '../stream.model'

/**
 * Polyfill of Readable.from(), that available in Node 12+
 */
export function readableFromArray<T>(items: T[], objectMode = true): ReadableTyped<T> {
  const readable = new Readable({
    objectMode,
    read() {},
  })
  items.forEach(item => readable.push(item))
  readable.push(null)
  return readable
}
