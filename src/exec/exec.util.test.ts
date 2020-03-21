import { execCommand, execShell } from './..'

beforeEach(() => {
  jest.restoreAllMocks()
})

test('execCommand ok', async () => {
  await execCommand('ls > /dev/null', {
    shell: true,
  })

  await execShell('ls > /dev/null')
})

test('execCommand error, exit', async () => {
  const processExit = jest.spyOn(process, 'exit').mockImplementation(code => {
    throw new Error(`process exit: ${code}`)
  })
  await expect(execCommand('abcd')).rejects.toThrow()
  expect(processExit).toMatchSnapshot()
})
