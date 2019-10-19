import { Readable, Writable } from 'stream'

/**
 * Reads stream, resolves promise with array of stream results in the end.
 */
export async function streamToArray<OUT = any>(
  stream: Readable,
  objectMode = true,
): Promise<OUT[]> {
  const results: OUT[] = []

  return new Promise<OUT[]>((resolve, reject) => {
    stream
      .pipe(
        new Writable({
          objectMode,
          write(chunk, _encoding, cb): void {
            // console.log(_encoding)
            results.push(chunk)
            cb()
          },
          final(cb): void {
            cb()
            stream.destroy()
            resolve(results)
          },
        }),
      )
      .on('error', err => reject(err))
  })
}
