import { _range } from '@naturalcycles/js-lib'
import { readableFrom, streamMap } from '../index'

test('streamMap simple', async () => {
  const data = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const items: any[] = []
  const res = await streamMap(readable, async item => {
    items.push(item)
  })
  expect(res).toEqual([])
  expect(items).toEqual(data)
})

test('streamMap returnResults=true', async () => {
  const data = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const res = await streamMap(readable, async item => item, { collectResults: true })
  expect(res).toEqual(data)
})
