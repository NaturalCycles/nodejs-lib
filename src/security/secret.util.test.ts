// const originalProcessEnv = process.env
process.env = {
  A: 'AAA',
  B: 'BBB',
  SECRET_A: 'VALUE A',
  SECRET_B: 'VALUE B',
  SECRET_J: 'eyJoZWxsbyI6InNlY3JldCB3b3JsZCJ9',
}

import { secretsJsonEncPath, secretsJsonPath, TEST_ENC_KEY } from '../test/test.cnst'
// order is important, secret.util should be loaded after the mocks
import {
  getSecretMap,
  loadSecretsFromEnv,
  loadSecretsFromJsonFile,
  secret,
  secretOptional,
  setSecretMap,
} from './secret.util'

test('secret', async () => {
  expect(() => secret('SECRET_A')).toThrow('not loaded')
  expect(() => getSecretMap()).toThrow('not loaded')

  loadSecretsFromEnv()

  expect(process.env.SECRET_A).toBeUndefined() // should be erased

  expect(getSecretMap()).toEqual({
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

  setSecretMap({ a: 'b' }) // should clear all other secrets! should uppercase keys
  expect(secretOptional('SECRET_A')).toBeUndefined()
  expect(secret('A')).toBe('b')
  expect(secret('a')).toBe('b')
})

test('loadSecretsFromJsonFile', async () => {
  setSecretMap({}) // reset

  loadSecretsFromJsonFile(secretsJsonPath)
  expect(secret('very')).toBe('secretuous')

  setSecretMap({}) // reset

  loadSecretsFromJsonFile(secretsJsonEncPath, TEST_ENC_KEY)
  expect(secret('very')).toBe('secretuous')
})
