import { promisify } from 'util'
import { ZlibOptions } from 'zlib'
import * as zlib from 'zlib'

const deflate = promisify(zlib.deflate.bind(zlib)) as Function
const inflate = promisify(zlib.inflate.bind(zlib)) as Function
const gzip = promisify(zlib.gzip.bind(zlib)) as Function
const gunzip = promisify(zlib.gunzip.bind(zlib)) as Function

// string > zip
export async function zipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return deflate(buf, options)
}

export async function gzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return gzip(buf, options)
}

// zip > buffer
export async function unzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return inflate(buf, options)
}

export async function gunzipBuffer(buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
  return gunzip(buf, options)
}

// convenience
export async function zipString(s: string, options?: ZlibOptions): Promise<Buffer> {
  return zipBuffer(Buffer.from(s), options)
}

export async function gzipString(s: string, options?: ZlibOptions): Promise<Buffer> {
  return gzipBuffer(Buffer.from(s), options)
}

// convenience
export async function unzipToString(buf: Buffer, options?: ZlibOptions): Promise<string> {
  return (await unzipBuffer(buf, options)).toString()
}

export async function gunzipToString(buf: Buffer, options?: ZlibOptions): Promise<string> {
  return (await gunzipBuffer(buf, options)).toString()
}
