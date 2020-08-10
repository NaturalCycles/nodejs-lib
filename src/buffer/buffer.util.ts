import { StringMap } from '@naturalcycles/js-lib'
import { unzipToString, zipString } from '..'

const ONE_MB = 1024 ** 2

/**
 * Use it to be able to "pack" arbitrary JSON object into a size-limited DB field.
 * E.g Datastore field is limited to 1Mb.
 * It achieves it with gzipping it into Buffer, and splitting into multiple fields named with postfixes 1, 2, 3, 4
 *
 * Use it together with `_unpackJsonField` that keeps same conventions.
 *
 * @returns an untyped object that looks like this:
 * {
 *   field1: Buffer,
 *   field2?: Buffer,
 *   field3?: Buffer,
 *   field4?: Buffer,
 *   ...
 * }
 *
 * Important! Your joi schema validation should allow these fields (not to strip them!)
 */
export async function _packJsonField(
  fieldName: string,
  json: any = {},
  size = ONE_MB,
): Promise<StringMap<Buffer>> {
  const buf = await zipString(JSON.stringify(json))
  const bufs = _chunkBuffer(buf, size)

  const out: StringMap<Buffer> = {}
  bufs.forEach((b, i) => (out[`${fieldName}${i + 1}`] = b))
  return out
}

/**
 * Symmetric method for `_packJsonField`.
 */
export async function _unpackJsonField(fieldName: string, row: object): Promise<unknown> {
  const buffers: Buffer[] = []

  // hard limit of 100 for now
  for (let i = 1; i < 100; i++) {
    const b = row[`${fieldName}${i}`]
    if (!b) break
    buffers.push(b)
  }

  return JSON.parse(await unzipToString(Buffer.concat(buffers)))
}

/**
 * Same as _chunk, but for Buffer.
 */
export function _chunkBuffer(buf: Buffer, size: number): Buffer[] {
  const out: Buffer[] = []

  for (let i = 0; i < buf.length; i += size) {
    out.push(buf.slice(i, i + size))
  }

  return out
}
