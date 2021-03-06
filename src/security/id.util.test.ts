import { stringId, stringIdAsync, stringIdUnsafe } from '../index'

test('stringId', () => {
  const id = stringId()
  expect(id).not.toBeUndefined()
  expect(id.length).toBe(16)
  expect(id.toLowerCase()).toBe(id)

  expect(stringId(32).length).toBe(32)
})

test('stringIdUnsafe', () => {
  const id = stringIdUnsafe()
  expect(id).not.toBeUndefined()
  expect(id.length).toBe(16)
  expect(id.toLowerCase()).toBe(id)

  expect(stringId(32).length).toBe(32)
})

test('stringIdAsync', async () => {
  const id = await stringIdAsync()
  expect(id).not.toBeUndefined()
  expect(id.length).toBe(16)
  expect(id.toLowerCase()).toBe(id)

  expect(stringId(32).length).toBe(32)
})
