import { _range, AggregatedError } from '@naturalcycles/js-lib'
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

test('streamMap collectResults=true', async () => {
  const data = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const res = await streamMap(readable, async item => item, { collectResults: true })
  expect(res).toEqual(data)
  expect(readable.destroyed).toBe(true)
})

test('streamMap exception', async () => {
  const data = _range(1, 5).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  await expect(
    streamMap(readable, async item => {
      if (item.id === '3') throw new Error('my error')
      return item
    }),
  ).rejects.toThrow('my error')

  expect(readable.destroyed).toBe(true)
})

test('streamMap exception stopOnError=false', async () => {
  const data = _range(1, 5).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const err: AggregatedError = await streamMap(
    readable,
    async item => {
      if (item.id === '3') throw new Error('my error')
      return item
    },
    { stopOnError: false, collectResults: true },
  ).catch(err => err)

  // console.log(err)
  expect(err).toMatchSnapshot()
  expect(err.errors).toMatchSnapshot()
  expect(err.results).toEqual(data.filter(r => r.id !== '3'))
  expect(readable.destroyed).toBe(true)
})

test('streamMap exception skipErrors=true', async () => {
  const data = _range(1, 5).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  expect(
    await streamMap(
      readable,
      async item => {
        if (item.id === '3') throw new Error('my error')
        return item
      },
      { skipErrors: true, collectResults: true },
    ),
  ).toEqual(data.filter(r => r.id !== '3'))

  expect(readable.destroyed).toBe(true)
})
