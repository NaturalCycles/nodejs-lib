import { _range } from '@naturalcycles/js-lib'
import { toArray } from 'rxjs/operators'
import { readableFrom, streamToObservable } from '../index'

interface Item {
  id: string
}

test('streamToObservable simple', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const res = await streamToObservable(readable)
    .pipe(toArray())
    .toPromise()
  expect(res).toEqual(data)
})

test('streamToObservable with mapper that returns undefined', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const items: Item[] = []
  const res = await streamToObservable(readable, {
    mapper: async item => {
      items.push(item)
    },
  })
    .pipe(toArray())
    .toPromise()

  expect(res).toEqual([])
  expect(items).toEqual(data)
})

test('streamToObservable with mapper ignoring Observable', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const items: Item[] = []
  await streamToObservable(readable, {
    mapper: async item => {
      items.push(item)
    },
  }).toPromise()

  expect(items).toEqual(data)
})

test('streamToObservable with mapper that maps to different type', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const res = await streamToObservable(readable, {
    mapper: async item => item.id,
  })
    .pipe(toArray())
    .toPromise()

  expect(res).toEqual(data.map(r => r.id))
  expect(readable.destroyed).toBe(true)
})

test('streamToObservable exception', async () => {
  const data: Item[] = _range(1, 5).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  await expect(
    streamToObservable(readable, {
      mapper: async item => {
        if (item.id === '3') throw new Error('my error')
        return item
      },
    }).toPromise(),
  ).rejects.toThrow('my error')

  expect(readable.destroyed).toBe(true)
})

test('streamToObservable exception skipErrors=true', async () => {
  const data: Item[] = _range(1, 5).map(n => ({ id: String(n) }))

  const readable = readableFrom(data)

  const items = await streamToObservable(readable, {
    mapper: async item => {
      if (item.id === '3') throw new Error('my error')
      return item
    },
    skipErrors: true,
    logErrors: false,
  })
    .pipe(toArray())
    .toPromise()

  expect(items).toEqual(data.filter(r => r.id !== '3'))

  expect(readable.destroyed).toBe(true)
})
