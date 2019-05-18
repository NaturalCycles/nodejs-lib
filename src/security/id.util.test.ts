import { stringId } from '../index'

test('stringId', () => {
  const id = stringId()
  expect(id).not.toBeUndefined()
  expect(id.length).toBe(16)
  expect(id.toLowerCase()).toBe(id)

  expect(stringId(32).length).toBe(32)
})
