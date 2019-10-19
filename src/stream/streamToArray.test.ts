import { _range } from '@naturalcycles/js-lib'
import { readableFrom } from './readableFrom'
import { streamToArray } from './streamToArray'

test('streamToArray strings', async () => {
  const data = _range(1, 4).map(String)

  const readable = readableFrom(data, false)

  const r = await streamToArray<Buffer>(readable, false)
  // console.log(r)
  expect(r.map(s => s.toString())).toEqual(data)
  expect(readable.destroyed).toBe(true)
})

test('streamToArray obj', async () => {
  const data = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const r = await streamToArray(readable)
  // console.log(r)
  expect(r).toEqual(data)
  expect(readable.destroyed).toBe(true)
})
