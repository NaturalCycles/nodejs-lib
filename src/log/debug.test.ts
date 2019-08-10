import { Debug } from './debug'

const log = Debug('nodejs-lib')

test('debug', () => {
  Debug.disable()
  expect(log.enabled).toBe(false)

  Debug.enable('abc')
  expect(log.enabled).toBe(false)

  Debug.enable('*')
  expect(log.enabled).toBe(true)

  log('hello logrld')
})
