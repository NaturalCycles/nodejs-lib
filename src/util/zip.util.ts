import { promisify } from 'util'
import { ZlibOptions } from 'zlib'
import * as zlib from 'zlib'

const deflate = promisify(zlib.deflate.bind(zlib)) as Function
const inflate = promisify(zlib.inflate.bind(zlib)) as Function

// string > zip
export async function zipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return deflate(buf, options)
}

// zip > buffer
export async function unzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return inflate(buf, options)
}

// convenience
export async function zipString(s: string, options?: ZlibOptions): Promise<Buffer> {
  return zipBuffer(Buffer.from(s), options)
}

// convenience
export async function unzipToString(buf: Buffer, options?: ZlibOptions): Promise<string> {
  return (await unzipBuffer(buf, options)).toString()
}
