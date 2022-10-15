import { Readable } from 'node:stream'
import { AppError, ErrorMode, _range, pTry } from '@naturalcycles/js-lib'
import { writableVoid, _pipeline } from '../..'
import { transformMapSync } from './transformMapSync'

interface Item {
  id: string
}

test('transformMapSync simple', async () => {
  const data: Item[] = _range(1, 4).map(n => ({ id: String(n) }))
  const readable = Readable.from(data)

  const data2: Item[] = []

  await _pipeline([readable, transformMapSync<Item, void>(r => void data2.push(r)), writableVoid()])

  expect(data2).toEqual(data)
  // expect(readable.destroyed).toBe(true)
})

test('transformMapSync error', async () => {
  const data = _range(100).map(String)

  const data2: string[] = []
  const [err] = await pTry(
    _pipeline([
      Readable.from(data),
      transformMapSync<string, void>((r, i) => {
        if (i === 50) {
          throw new AppError('error on 50th')
        }

        data2.push(r)
      }),
      writableVoid(),
    ]),
  )

  expect(err).toBeInstanceOf(AppError)
  expect(err).toMatchInlineSnapshot(`[AppError: error on 50th]`)

  expect(data2).toEqual(data.slice(0, 50))
})

test('transformMapSync suppressed error', async () => {
  const data = _range(100).map(String)

  const data2: string[] = []
  await _pipeline([
    Readable.from(data),
    transformMapSync<string, void>(
      (r, i) => {
        if (i === 50) {
          throw new AppError('error on 50th')
        }

        data2.push(r)
      },
      {
        errorMode: ErrorMode.SUPPRESS,
      },
    ),
    writableVoid(),
  ])

  expect(data2).toEqual(data.filter(r => r !== '50'))
})
