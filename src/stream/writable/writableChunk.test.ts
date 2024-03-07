import { createGzip } from 'node:zlib'
import { transformMap, writablePushToArray, _pipeline, readableCreate } from '../..'
import { writableChunk } from './writableChunk'

// jest.setTimeout(900_000)

test('writableChunk', async () => {
  const allData: string[][] = []
  const array1: string[] = [1, 2, 3, 4, 5].map(n => n + '\n')
  const array2: string[] = [6, 7, 8, 9].map(n => n + '\n')

  const readableInput = readableCreate<number>()

  let i = 0
  const interval = setInterval(() => {
    readableInput.push(++i)
    if (i >= 9) {
      clearInterval(interval)
      readableInput.push(null) // complete
    }
  }, 100)

  await _pipeline([
    readableInput,
    transformMap<number, string>(
      n => {
        console.log(`mapper ${n}`)
        return n + '\n'
      },
      { concurrency: 1 },
    ),
    writableChunk(
      // Split every 5th row
      (row: string) => Number.parseInt(row) % 5 === 0,
      // no transforms
      [],
      (_: number) => {
        const newArray: string[] = []
        allData.push(newArray)
        return writablePushToArray(newArray)
      },
    ),
  ])
  expect(allData).toEqual([array1, array2])

  // console.log('done')
})

test('writableChunk with Gzip', async () => {
  const allData: string[][] = []

  const readableInput = readableCreate<number>()

  let i = 0
  const interval = setInterval(() => {
    readableInput.push(++i)
    if (i >= 9) {
      clearInterval(interval)
      readableInput.push(null) // complete
    }
  }, 100)

  await _pipeline([
    readableInput,
    transformMap<number, string>(
      n => {
        console.log(`mapper ${n}`)
        return n + '\n'
      },
      { concurrency: 1 },
    ),
    writableChunk(
      // Split every 5th row
      (row: string) => Number.parseInt(row) % 5 === 0,
      // no transforms
      [createGzip],
      (_: number) => {
        const newArray: string[] = []
        allData.push(newArray)
        return writablePushToArray(newArray)
      },
    ),
  ])
  expect(allData).toMatchInlineSnapshot(`
[
  [
    {
      "data": [
        31,
        139,
        8,
        0,
        0,
        0,
        0,
        0,
        0,
        19,
      ],
      "type": "Buffer",
    },
    {
      "data": [
        51,
        228,
        50,
        226,
        50,
        230,
        50,
        225,
        50,
        229,
        2,
        0,
        138,
        172,
        105,
        106,
        10,
        0,
        0,
        0,
      ],
      "type": "Buffer",
    },
  ],
  [
    {
      "data": [
        31,
        139,
        8,
        0,
        0,
        0,
        0,
        0,
        0,
        19,
      ],
      "type": "Buffer",
    },
    {
      "data": [
        51,
        227,
        50,
        231,
        178,
        224,
        178,
        228,
        2,
        0,
        85,
        196,
        102,
        7,
        8,
        0,
        0,
        0,
      ],
      "type": "Buffer",
    },
  ],
]
`)

  // console.log('done')
})
