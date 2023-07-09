import { _omit } from '@naturalcycles/js-lib'
import { _readFileSync } from '../fs/fs.util'
import { testDir } from '../test/paths.cnst'
import { numberSchema, objectSchema, stringSchema } from '../validation/joi/joi.shared.schemas'
import { JWTService } from './jwt.service'

const jwtService = new JWTService({
  privateKey: _readFileSync(`${testDir}/demoPrivateKey.pem`),
  publicKey: _readFileSync(`${testDir}/demoPrivateKey.pem`),
  algorithm: 'ES256',
})

interface Data {
  accountId: string
  num: number
}

const dataSchema = objectSchema<Data>({
  accountId: stringSchema,
  num: numberSchema,
})

const data1: Data = {
  accountId: 'abc123',
  num: 3,
}

test('jwtService all operations', () => {
  const token1 = jwtService.sign(data1, dataSchema)
  expect(
    token1.startsWith(
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJhYmMxMjMiLCJudW0iOjN9.',
    ),
  ).toBe(true)

  const decoded1 = jwtService.decode(token1, dataSchema)
  expect(decoded1.signature).toBeDefined()
  expect(_omit(decoded1, ['signature'])).toMatchInlineSnapshot(`
    {
      "header": {
        "alg": "ES256",
        "typ": "JWT",
      },
      "payload": {
        "accountId": "abc123",
        "num": 3,
      },
    }
  `)

  const verified1 = jwtService.verify<Data>(token1, dataSchema)
  expect(verified1).toStrictEqual(data1)
})

test('malformed token', () => {
  const token1 = jwtService.sign(data1, dataSchema)
  const token2 = token1.slice(1)
  const token3 = token1.slice(0, token1.length - 2)

  expect(() => jwtService.verify(token2)).toThrowErrorMatchingInlineSnapshot(`"invalid token"`)
  expect(() => jwtService.verify(token3)).toThrowErrorMatchingInlineSnapshot(
    `""ES256" signatures must be "64" bytes, saw "63""`,
  )

  expect(() => jwtService.decode(token2)).toThrowErrorMatchingInlineSnapshot(
    `"invalid token, decoded value is empty"`,
  )

  // token3 has corrupted signature, but Decode doesn't use it
  const data2 = jwtService.decode(token3)
  expect(data2.payload).toStrictEqual(data1)
})
