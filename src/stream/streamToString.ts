import { Readable, Transform } from 'stream'

export async function streamToString(stream: Readable, joinOn = ''): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = []

    stream
      .pipe(
        new Transform({
          transform(chunk, _encoding, cb) {
            chunks.push(chunk)
            cb()
          },
          final(cb) {
            cb()
            resolve(chunks.join(joinOn))
          },
        }),
      )
      .on('error', err => reject(err))
  })
}
