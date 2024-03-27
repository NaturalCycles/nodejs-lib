import { createGzip } from 'node:zlib'
import { pMap } from '@naturalcycles/js-lib'
import { transformMap, writablePushToArray, _pipeline, readableCreate, gunzipToString } from '../..'
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
})

test('writableChunk with Gzip', async () => {
  const allData: Buffer[][] = []
  const file1: string = [1, 2, 3, 4, 5].map(n => n + '\n').join('')
  const file2: string = [6, 7, 8, 9].map(n => n + '\n').join('')

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
      // gzipped data
      [createGzip],
      (_: number) => {
        const newArray: Buffer[] = []
        allData.push(newArray)
        return writablePushToArray(newArray)
      },
    ),
  ])
  const unzippedData = await pMap(allData, async buff => {
    return await gunzipToString(Buffer.concat(buff))
  })
  expect(unzippedData).toEqual([file1, file2])
})
