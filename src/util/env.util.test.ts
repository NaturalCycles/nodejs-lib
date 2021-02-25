import { requireEnvKeys, requireFileToExist } from '../index'

test('requireEnvKeys', () => {
  expect(() => requireEnvKeys('NON_EXISTING')).toThrow()

  process.env['AAAA'] = 'aaaa'
  expect(requireEnvKeys('AAAA')).toEqual({
    AAAA: 'aaaa',
  })

  process.env['BBBB'] = '' // not allowed
  expect(() => requireEnvKeys('BBBB')).toThrow()

  process.env['CCCC'] = 'cccc'
  expect(requireEnvKeys('AAAA', 'CCCC')).toEqual({
    AAAA: 'aaaa',
    CCCC: 'cccc',
  })
})

test('requireFileToExist', async () => {
  // should not throw
  requireFileToExist(`${__dirname}/env.util.ts`)

  expect(() => requireFileToExist(`${__dirname}/non-existing`)).toThrow()
})
