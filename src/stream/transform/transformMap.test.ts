import { AggregatedError, AsyncMapper, ErrorMode, _range } from '@naturalcycles/js-lib'
import { Readable } from 'stream'
import { readableFromArray, writablePushToArray, _pipeline } from '../..'
import { transformMap } from './transformMap'

interface Item {
  id: string
}

// Mapper that throws 'my error' on third id
const mapperError3: AsyncMapper<Item, Item> = item => {
  if (item.id === '3') throw new Error('my error')
  return item
}

test('transformMap simple', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))
  const readable = Readable.from(data)

  const data2: Item[] = []

  await _pipeline([readable, transformMap<Item, void>(r => void data2.push(r))])

  expect(data2).toEqual(data)
  // expect(readable.destroyed).toBe(true)
})

test('transformMap with mapping', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))
  const data2: Item[] = []

  await _pipeline([
    readableFromArray(data),
    transformMap(r => ({
      id: r.id + '!',
    })),
    writablePushToArray(data2),
  ])

  expect(data2).toEqual(data.map(r => ({ id: r.id + '!' })))
})

test('transformMap emit array as multiple items', async () => {
  const data = _range(1, 4)
  const data2: number[] = []

  await _pipeline([
    readableFromArray(data),
    transformMap(n => [n * 2, n * 2 + 1], { flattenArrayOutput: true }),
    writablePushToArray(data2),
  ])

  const expected: number[] = []
  data.forEach(n => {
    expected.push(n * 2, n * 2 + 1)
  })

  // console.log(data2)

  expect(data2).toEqual(expected)
})

test('transformMap objectMode=false', async () => {
  const data: string[] = _range(1, 4).map(n => String(n))
  const readable = Readable.from(data)

  const data2: string[] = []

  await _pipeline([
    readable,
    transformMap<Buffer, void>(r => void data2.push(String(r)), { objectMode: false }),
  ])

  expect(data2).toEqual(data)
})

test('transformMap errorMode=THROW_IMMEDIATELY', async () => {
  const data: Item[] = _range(1, 5).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)
  const data2: Item[] = []

  await expect(
    _pipeline([
      readable,
      transformMap(mapperError3, { concurrency: 1 }),
      transformMap<Item, void>(r => void data2.push(r)),
    ]),
  ).rejects.toThrow('my error')

  expect(data2).toEqual(data.filter(r => Number(r.id) < 3))

  // expect(readable.destroyed).toBe(true)
})

test('transformMap errorMode=THROW_AGGREGATED', async () => {
  const data: Item[] = _range(1, 5).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)
  const data2: Item[] = []

  await expect(
    _pipeline([
      readable,
      transformMap(mapperError3, { errorMode: ErrorMode.THROW_AGGREGATED }),
      transformMap<Item, void>(r => void data2.push(r)),
    ]),
  ).rejects.toThrow(AggregatedError)

  expect(data2).toEqual(data.filter(r => r.id !== '3'))

  // expect(readable.destroyed).toBe(true)
})

test('transformMap errorMode=SUPPRESS', async () => {
  const data: Item[] = _range(1, 5).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)

  const data2: Item[] = []
  await _pipeline([
    readable,
    transformMap(mapperError3, { errorMode: ErrorMode.SUPPRESS }),
    transformMap<Item, void>(r => void data2.push(r)),
  ])

  expect(data2).toEqual(data.filter(r => r.id !== '3'))

  // expect(readable.destroyed).toBe(true)
})
