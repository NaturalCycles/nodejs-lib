import { _range } from '@naturalcycles/js-lib'
import { expect, test } from 'vitest'
import { _pipeline, readableFromArray } from '../..'
import { transformMap } from './transformMap'
import { transformToArray } from './transformToArray'

interface Item {
  id: string
}

test('transformToArray', async () => {
  const items: Item[] = _range(1, 6).map(num => ({
    id: String(num),
  }))
  const readable = readableFromArray(items)

  const items2: Item[] = []

  await _pipeline([
    readable,
    transformToArray<Item>(),
    transformMap<Item[], void>(rows => void items2.push(...rows)),
  ])
  expect(items2).toEqual(items)
})
