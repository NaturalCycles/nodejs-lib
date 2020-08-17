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
