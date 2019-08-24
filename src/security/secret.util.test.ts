// const originalProcessEnv = process.env
process.env = {
  A: 'AAA',
  B: 'BBB',
  SECRET_A: 'VALUE A',
  SECRET_B: 'VALUE B',
  SECRET_J: 'eyJoZWxsbyI6InNlY3JldCB3b3JsZCJ9',
}

// order is important, secret.util should be loaded after the mocks
import { loadSecrets, secret, secretMap, secretOptional } from './secret.util'

test('secret', async () => {
  loadSecrets()

  expect(secretMap).toEqual({
    SECRET_A: 'VALUE A',
    SECRET_B: 'VALUE B',
    SECRET_J: 'eyJoZWxsbyI6InNlY3JldCB3b3JsZCJ9',
  })

  expect(secretOptional('N')).toBeUndefined()
  expect(() => secret('N')).toThrow()
  expect(secret('SECRET_A')).toBe('VALUE A')
  expect(secret('secret_a')).toBe('VALUE A')
  expect(secret('seCrEt_a')).toBe('VALUE A')
  expect(secret('SECRET_B')).toBe('VALUE B')
  expect(secret('SECRET_J')).toBe('eyJoZWxsbyI6InNlY3JldCB3b3JsZCJ9')
  expect(secret('SECRET_J', true)).toEqual({
    hello: 'secret world',
  })
})
