import { Debug, DebugLogLevel } from './debug'

const log = Debug('nodejs-lib')

const obj = {
  a: 'a1',
  b: 'b1',
  n: 15,
  d: {
    ooo: null,
  },
}

const err = new Error('Im an error')

test('debug', () => {
  Debug.disable()
  expect(log.enabled).toBe(false)

  Debug.enable('abc')
  expect(log.enabled).toBe(false)

  Debug.enable('*')
  expect(log.enabled).toBe(true)

  log('hello log', obj)
  log.info('hello log', obj)
  log.debug('hello log', obj)
  log.warn('hello log', obj)
  log.error('hello log', obj)

  const level = DebugLogLevel.warn
  log[level]('hello level')

  log(err)
  log.debug(err)
  log.warn(err)
  log.error(err)
})
