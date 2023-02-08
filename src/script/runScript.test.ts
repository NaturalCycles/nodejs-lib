import { _stringifyAny, pDelay, setGlobalStringifyFunction } from '@naturalcycles/js-lib'
import { inspectAnyStringifyFn } from '../string/inspectAny'
import { runScript } from '.'

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

// skipped, because mocking process.exit no longer works
test.skip('runScript', async () => {
  if (detectLeaks) return // Somehow it fails with detect-leaks SOMETIMES
  const processExit = jest.spyOn(process, 'exit').mockImplementation()
  const consoleError = jest.spyOn(console, 'error').mockImplementation()
  runScript(async () => {})
  await pDelay() // because runScript is not actually async
  expect(processExit).toHaveBeenCalledTimes(1)
  expect(processExit).toHaveBeenCalledWith(0)
  expect(process.exitCode).toBeUndefined()
  expect(consoleError).toHaveBeenCalledTimes(0)

  jest.resetAllMocks() // resets counters

  runScript(async () => {
    throw new Error('bad')
  })
  await pDelay() // because runScript is not actually async
  expect(process.exitCode).toBe(1)
  expect(processExit).toHaveBeenCalledTimes(1)
  expect(processExit).toHaveBeenCalledWith(1)
  expect(consoleError).toHaveBeenCalledTimes(1)
})

test('setGlobalStringifyFunction', () => {
  jest.spyOn(process, 'exit').mockImplementation()

  setGlobalStringifyFunction(inspectAnyStringifyFn)

  expect(
    _stringifyAny({
      hello: 'world',
      a: { b: 'c' },
    }),
  ).toMatchInlineSnapshot(`"{ hello: 'world', a: { b: 'c' } }"`)
})
