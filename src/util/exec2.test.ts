import { _expectedErrorString, _stringify, pExpectedError } from '@naturalcycles/js-lib'
import { exec2, SpawnError } from './exec2'

test('spawn ok', () => {
  exec2.spawn('git status', {
    log: true,
  })
  // no error
})

test('spawn error', () => {
  const err = _expectedErrorString(() =>
    exec2.spawn('git stat', {
      log: true,
    }),
  )
  expect(err).toMatchInlineSnapshot(`"Error: spawn exited with code 1: git stat"`)
})

test('exec ok', () => {
  const s = exec2.exec('git version', {
    log: true,
  })
  expect(s.startsWith('git version')).toBe(true)
})

test('exec error', () => {
  const err = _expectedErrorString(() =>
    exec2.exec('git stat', {
      log: true,
    }),
  )
  expect(err).toMatchInlineSnapshot(`"Error: exec exited with code 1: git stat"`)
})

test('spawnAsync ok', async () => {
  const s = await exec2.spawnAsync('git version', {
    log: true,
  })
  expect(s.exitCode).toBe(0)
  expect(s.stderr).toBe('')
  expect(s.stdout.startsWith('git version')).toBe(true)
})

test('spawnAsync error with throw', async () => {
  const err = await pExpectedError(exec2.spawnAsync('git stat'), SpawnError)
  expect(_stringify(err)).toMatchInlineSnapshot(
    `"SpawnError: spawnAsync exited with code 1: git stat"`,
  )
  expect(err.data.exitCode).toBe(1)
  expect(err.data.stdout).toBe('')
  expect(err.data.stderr).toMatchInlineSnapshot(`
"git: 'stat' is not a git command. See 'git --help'.

The most similar commands are
	status
	stage
	stash"
`)
})

test('spawnAsync error without throw', async () => {
  const { exitCode, stdout, stderr } = await exec2.spawnAsync('git stat', {
    log: true,
    throwOnNonZeroCode: false,
  })
  expect(exitCode).toBe(1)
  expect(stdout).toBe('')
  expect(stderr).toMatchInlineSnapshot(`
"git: 'stat' is not a git command. See 'git --help'.

The most similar commands are
	status
	stage
	stash"
`)
})
