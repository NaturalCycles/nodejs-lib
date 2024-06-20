import { expectTypeOf } from '@naturalcycles/dev-lib/dist/testing'
import { BaseDBEntity } from '@naturalcycles/js-lib'
import { testValidation } from '../../test/validation.test.util'
import {
  baseDBEntitySchema,
  binarySchema,
  dateObjectSchema,
  emailSchema,
  idSchema,
  numberSchema,
  objectSchema,
  oneOfSchema,
  semVerSchema,
  stringSchemaTyped,
  stringSchema,
  urlSchema,
  stringEnumValueSchema,
  stringEnumKeySchema,
  numberSchemaTyped,
  numberEnumValueSchema,
  numberEnumKeySchema,
  dateIntervalStringSchema,
  ianaTimezoneSchema,
} from './joi.shared.schemas'
import { isValid, validate } from './joi.validation.util'

test('semVerSchema', () => {
  testValidation(
    semVerSchema,
    ['1.0.0', '1.5.3', '2.9.4', '3.0.14', '0.0.14'],
    [undefined, null, '', 3, '1.', '1.5.', '1.5.x', '1.5.e', '1', '1.5', '1.5.3.2'],
  )
})

test('urlSchema', () => {
  const schema = urlSchema()
  const schemaAllowHttp = urlSchema(['https', 'http'])

  expect(() => validate('abc', schema)).toThrow()

  validate('https://example.com', schema)
  expect(() => validate('http://example.com', schema)).toThrow()

  validate('https://example.com', schemaAllowHttp)
  validate('http://example.com', schemaAllowHttp)
})

test('emailSchema should do TLD validation by default', () => {
  expect(isValid('#$%', emailSchema)).toBe(false)
  expect(isValid('test@gmail.com', emailSchema)).toBe(true)
  expect(isValid('test@gmail.con', emailSchema)).toBe(false)
})

test('possibility to disable TLD email validation', () => {
  const schema = stringSchema.email({ tlds: false }).lowercase()
  expect(isValid('#$%', schema)).toBe(false)
  expect(isValid('test@gmail.com', schema)).toBe(true)
  expect(isValid('test@gmail.con', schema)).toBe(true)
})

test('emailSchema should lowercase', () => {
  expect(validate('test@GMAIL.cOm', emailSchema)).toBe('test@gmail.com')
})

test('oneOfSchema', () => {
  const s = oneOfSchema(stringSchema, binarySchema)

  // Should pass
  validate('abc', s)
  validate('', s)
  validate(Buffer.from('abc'), s)

  expect(isValid(5, s)).toBe(false)
  expect(isValid(['s'], s)).toBe(false)
})

test.each(['123456', '123456a', '123456aB', '123456aB_', `a`.repeat(30), `a`.repeat(64)])(
  'valid idSchema: %s',
  s => {
    validate(s, idSchema)
  },
)

test.each([
  '1',
  '12',
  45,
  '12345',
  '12345-',
  '12345%',
  '12345$',
  '12345&',
  '12345^',
  '12345@',
  `a`.repeat(65),
  `a`.repeat(129),
])('invalid idSchema: %s', s => {
  expect(isValid(s, idSchema)).toBe(false)
})

test('other schemas', () => {
  validate(new Date(), dateObjectSchema)
  expect(isValid('2022-01-01', dateObjectSchema)).toBe(false)
})

interface Obj extends BaseDBEntity {
  v: number
}

const _objSchema = objectSchema<Obj>({
  v: numberSchema,
}).concat(baseDBEntitySchema as any)

enum OS {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

enum AppId {
  APP1 = 1,
  APP2 = 2,
}

test('enum schemas', () => {
  let os = validate(OS.IOS, stringSchemaTyped<OS>())
  expectTypeOf(os).toEqualTypeOf<OS>()

  os = validate(OS.IOS, stringEnumValueSchema(OS))
  expectTypeOf(os).toEqualTypeOf<OS>()

  expect(isValid(OS.IOS, stringEnumValueSchema(OS))).toBe(true)
  expect(isValid('bad' as OS, stringEnumValueSchema(OS))).toBe(false)

  const osKey = validate(OS.IOS, stringEnumKeySchema(OS))
  expectTypeOf(osKey).toEqualTypeOf<string>()

  let appId = validate(AppId.APP1, numberSchemaTyped<AppId>())
  expectTypeOf(appId).toEqualTypeOf<AppId>()

  appId = validate(AppId.APP1, numberEnumValueSchema(AppId))
  expectTypeOf(appId).toEqualTypeOf<AppId>()

  const appIdKey = validate(AppId[AppId.APP1], numberEnumKeySchema(AppId))
  expectTypeOf(appIdKey).toEqualTypeOf<string>()
})

test('dateIntervalSchema', () => {
  const schema = dateIntervalStringSchema

  validate('2022-01-01/2022-01-02', schema)
  expect(() => validate(undefined, schema)).toThrowErrorMatchingInlineSnapshot(
    `""value" is required"`,
  )
  expect(() => validate('2022-01-01', schema)).toThrowErrorMatchingInlineSnapshot(
    `"must be a DateInterval string"`,
  )
  expect(() => validate('2022-01-01/2022-01-0', schema)).toThrowErrorMatchingInlineSnapshot(
    `"must be a DateInterval string"`,
  )
  expect(() => validate('2022-01-01/2022-01-02/', schema)).toThrowErrorMatchingInlineSnapshot(
    `"must be a DateInterval string"`,
  )
  expect(() =>
    validate('2022-01-01/2022-01-02/2022-01-03', schema),
  ).toThrowErrorMatchingInlineSnapshot(`"must be a DateInterval string"`)
})

test('ianaTimezoneSchema', () => {
  const schema = ianaTimezoneSchema

  validate('Europe/London', schema)
  validate('UTC', schema) // to support unit testing
  expect(() => validate(undefined, schema)).toThrowErrorMatchingInlineSnapshot(
    `""value" is required"`,
  )
  expect(() => validate('London', schema)).toThrowErrorMatchingInlineSnapshot(
    `"must be a valid IANA timezone string"`,
  )
})
