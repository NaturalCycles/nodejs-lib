import { requireEnvKeys } from '../index'

test('requireEnvKeys', () => {
  expect(() => requireEnvKeys('NON_EXISTING')).toThrow()

  process.env.AAAA = 'aaaa'
  expect(requireEnvKeys('AAAA')).toEqual({
    AAAA: 'aaaa',
  })

  process.env.BBBB = '' // not allowed
  expect(() => requireEnvKeys('BBBB')).toThrow()

  process.env.CCCC = 'cccc'
  expect(requireEnvKeys('AAAA', 'CCCC')).toEqual({
    AAAA: 'aaaa',
    CCCC: 'cccc',
  })
})
