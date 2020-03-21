import { Readable } from 'stream'
import { ReadableTyped } from '../stream.model'

/**
 * Convenience function to create a Readable that can be pushed into (similar to RxJS Subject).
 * Push `null` to it to complete (similar to RxJS `.complete()`).
 */
export function readableCreate<T>(items: T[] = [], objectMode = true): ReadableTyped<T> {
  const readable = new Readable({
    objectMode,
    read() {},
  })
  items.forEach(item => readable.push(item))
  return readable
}
