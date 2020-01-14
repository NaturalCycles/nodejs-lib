import { _range } from '@naturalcycles/js-lib'
import { _pipeline, transformMap, writablePushToArray } from '../..'
import { readableCreate } from '../..'
import { writableFork } from './writableFork'

// jest.setTimeout(900_000)

test('writableFork', async () => {
  // const out1Path = `${tmpDir}/out1.txt`
  // const out2Path = `${tmpDir}/out2.txt`
  // await fs.ensureFile(out1Path)
  // await fs.ensureFile(out2Path)
  const data = _range(1, 11)
  const array1: string[] = []
  const array2: string[] = []

  const readableInput = readableCreate<number>()

  let i = 0
  const interval = setInterval(() => {
    readableInput.push(++i)
    if (i >= 10) {
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
    writableFork([
      // Chain1: write all
      [
        // fs.createWriteStream(out1Path),
        writablePushToArray(array1),
      ],
      // Chain2: write only odd numbers
      [
        transformMap(s => {
          if (parseInt(s) % 2 !== 1) return // will be skipped
          return s // proceed
        }),
        // fs.createWriteStream(out2Path),
        writablePushToArray(array2),
      ],
    ]),
  ])

  expect(array1).toEqual(data.map(n => n + '\n'))
  expect(array2).toEqual(data.filter(n => n % 2 === 1).map(n => n + '\n'))

  // console.log('done')
})
