import { _range } from '@naturalcycles/js-lib'
import { _chunkBuffer, _packJsonField, _unpackJsonField } from './buffer.util'

test('_packJsonField', async () => {
  const items: string[] = []
  // Pack 100k of "accountIds"
  _range(0, 1_000_000).forEach(i => {
    items.push(String(i).repeat(10))
  })

  // 2.x Mb of data here
  // const buf = await zipString(JSON.stringify(items))
  // console.log(_hb(buf.length))

  const row = await _packJsonField('accountMap', items, 1024 ** 2)
  // console.log(row)

  const items2 = await _unpackJsonField('accountMap', row)
  // console.log(items2)
  expect(items2).toEqual(items)
})

test('_chunkBuffer', () => {
  const buf = Buffer.from(_range(1, 11))

  // <Buffer 01 02 03 04 05 06 07 08 09 0a>
  // console.log(buf)

  const bufs = _chunkBuffer(buf, 3)
  // console.log(bufs)

  expect(bufs).toStrictEqual([
    Buffer.from([1, 2, 3]),
    Buffer.from([4, 5, 6]),
    Buffer.from([7, 8, 9]),
    Buffer.from([10]),
  ])
})
