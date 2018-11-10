import { getDebug } from './debug'

test('debug', () => {
  const debug = getDebug(__filename)
  // debug.enabled = true
  // console.log(debug)
  expect(debug.namespace).toBe('debug.test')
  debug('hello')
})
