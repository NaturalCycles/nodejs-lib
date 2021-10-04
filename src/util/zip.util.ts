import { promisify } from 'util'
import { ZlibOptions } from 'zlib'
import * as zlib from 'zlib'

const deflate = promisify(zlib.deflate.bind(zlib))
const inflate = promisify(zlib.inflate.bind(zlib))
const gzip = promisify(zlib.gzip.bind(zlib))
const gunzip = promisify(zlib.gunzip.bind(zlib))

// string > zip
/**
 * zipBuffer uses `deflate`.
 * It's 9 bytes shorter than gzip.
 */
export async function zipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return await deflate(buf, options)
}

/**
 * gzipBuffer uses `gzip`
 * It's 9 bytes longer than deflate.
 */
export async function gzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return await gzip(buf, options)
}

// zip > buffer
export async function unzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return await inflate(buf, options)
}

export async function gunzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return await gunzip(buf, options)
}

// convenience
export async function zipString(s: string, options?: ZlibOptions): Promise<Buffer> {
  return await zipBuffer(Buffer.from(s), options)
}

export async function gzipString(s: string, options?: ZlibOptions): Promise<Buffer> {
  return await gzipBuffer(Buffer.from(s), options)
}

// convenience
export async function unzipToString(buf: Buffer, options?: ZlibOptions): Promise<string> {
  return (await unzipBuffer(buf, options)).toString()
}

export async function gunzipToString(buf: Buffer, options?: ZlibOptions): Promise<string> {
  return (await gunzipBuffer(buf, options)).toString()
}
