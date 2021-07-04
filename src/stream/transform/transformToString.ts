import { Transform } from 'stream'
import { TransformTyped } from '../stream.model'

/**
 * Transforms objectMode=false Buffers/strings into objectMode=true strings.
 *
 * Useful in this _pipeline:
 * fs.createReadStream(inputPath),
 * createUnzip(), // binary
 * transformSplit(), // string chunks, but objectMode==false
 * transformToString(), // string chunks, but objectMode==true
 */
export function transformToString(): TransformTyped<Buffer, string> {
  return new Transform({
    objectMode: false,
    readableObjectMode: true,
    transform(chunk: Buffer, _encoding, cb) {
      // console.log(`enc: ${_encoding}`, chunk.toString())
      cb(null, chunk.toString())
    },
  })
}
