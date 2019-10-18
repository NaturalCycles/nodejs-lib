import { Writable } from 'stream'

/**
 * Reads stream, resolves promise with array of stream results in the end.
 */
export async function streamToArray<OUT = any>(
  stream: NodeJS.ReadableStream,
  objectMode = true,
): Promise<OUT[]> {
  const results: OUT[] = []

  return new Promise<OUT[]>(resolve => {
    stream.pipe(
      new Writable({
        objectMode,
        write(chunk, _encoding, cb): void {
          // console.log(_encoding)
          results.push(chunk)
          cb()
        },
        final(cb): void {
          resolve(results)
          cb()
        },
      }),
    )
  })
}
