import { promisify } from 'util'
import { ZlibOptions } from 'zlib'
import * as zlib from 'zlib'

const deflate = promisify(zlib.deflate.bind(zlib)) as Function
const inflate = promisify(zlib.inflate.bind(zlib)) as Function

class ZipSharedUtil {
  // string > zip
  async zip (buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
    return deflate(buf, options)
  }

  // zip > buffer
  async unzip (buf: Buffer, options: ZlibOptions = {}): Promise<Buffer> {
    return inflate(buf, options)
  }

  // convenience
  async zipString (s: string, options?: ZlibOptions): Promise<Buffer> {
    return this.zip(Buffer.from(s), options)
  }

  // convenience
  async unzipToString (buf: Buffer, options?: ZlibOptions): Promise<string> {
    return (await this.unzip(buf, options)).toString()
  }
}

export const zipSharedUtil = new ZipSharedUtil()
