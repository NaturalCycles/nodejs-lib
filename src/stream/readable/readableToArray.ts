import { ReadableTyped } from '../stream.model'

/**
 * Convenience function to read the whole Readable stream into Array (in-memory)
 * and return that array.
 */
export async function readableToArray<T>(readable: ReadableTyped<T>): Promise<T[]> {
  const a: T[] = []

  for await (const item of readable) {
    a.push(item)
  }

  return a
}
