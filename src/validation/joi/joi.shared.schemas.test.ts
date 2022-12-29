import { testValidation } from '../../test/validation.test.util'
import {
  binarySchema,
  dateObjectSchema,
  emailSchema,
  idSchema,
  oneOfSchema,
  semVerSchema,
  stringSchema,
  urlSchema,
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
