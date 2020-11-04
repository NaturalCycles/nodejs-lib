import { Readable, ReadableOptions } from 'stream'
import { ReadableTyped } from '../stream.model'

/**
 * Convenience function to create a Readable that can be pushed into (similar to RxJS Subject).
 * Push `null` to it to complete (similar to RxJS `.complete()`).
 *
 * Difference from Readable.from() is that this readable is not "finished" yet and allows pushing more to it.
 */
export function readableCreate<T>(items: T[] = [], opt?: ReadableOptions): ReadableTyped<T> {
  const readable = new Readable({
    objectMode: true,
    ...opt,
    read() {},
  })
  items.forEach(item => readable.push(item))
  return readable
}
