import { pDelay } from '@naturalcycles/js-lib'
import { runScript } from './runScript'

test('runScript', async () => {
  const processExit = jest.spyOn(process, 'exit').mockImplementation()
  const consoleError = jest.spyOn(console, 'error').mockImplementation()
  runScript(async () => {})
  await pDelay() // because runScript is not actually async
  expect(processExit).toHaveBeenCalledTimes(1)
  expect(processExit).toHaveBeenCalledWith(0)
  expect(process.exitCode).toBeUndefined()
  expect(consoleError).toHaveBeenCalledTimes(0)

  jest.resetAllMocks() // resets counters

  runScript(async () => Promise.reject(new Error('bad')))
  await pDelay() // because runScript is not actually async
  expect(process.exitCode).toBe(1)
  // expect(processExit).toHaveBeenCalledTimes(1)
  // expect(processExit).toHaveBeenCalledWith(1)
  expect(consoleError).toHaveBeenCalledTimes(1)
})
