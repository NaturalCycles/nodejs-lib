import { Readable } from 'stream'

/**
 * Polyfill of Readable.from(), that available in Node 12+
 */
export function readableFrom(items: any[], objectMode = true): Readable {
  const readable = new Readable({
    objectMode,
    read() {},
  })
  items.forEach(item => readable.push(item))
  readable.push(null)
  return readable
}
