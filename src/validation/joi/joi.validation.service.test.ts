import { stringSchema } from './joi.shared.schemas'
import { JoiValidationError } from './joi.validation.error'
import { joiValidationService } from './joi.validation.service'

const schema = {
  a1: stringSchema.min(2).max(5),
  a2: stringSchema.min(2).optional(),
}

const invalidValues: any[] = [
  undefined,
  null,
  '',
  'abc',
  5,
  () => 'a',
  { a1: 'a' },
  { a1: 'a12345' },
]

const validValues: any[] = [
  {
    a1: 'ff',
  },
  {
    a1: 'ff',
    a2: 'sdfer',
  },
]

test('should fail on invalid values', () => {
  invalidValues.forEach(v => {
    expect(() => joiValidationService.validate(v, schema)).toThrowErrorMatchingSnapshot()
  })
})

test('should pass on valid values', () => {
  validValues.forEach(v => {
    joiValidationService.validate(v, schema)
  })
})

test('should trim strings by default', async () => {
  const v = { a1: ' sdf ' }
  const v2 = joiValidationService.validate(v, schema)

  expect(v2.a1).toBe('sdf')
  expect(v === v2).toBeFalsy() // object should be cloned
})

test('should strip unknown keys', async () => {
  const v = {
    a1: 'ff',
    unk: 'ddd',
  }
  const v2 = joiValidationService.validate(v, schema)

  expect(v2).toEqual({ a1: 'ff' })
  expect(v2.unk).toBeUndefined()
})

test('getValidationResult should still convert', async () => {
  const v = {
    a1: ' ff ', // to be converted
    a2: 'a', // invalid!
  }
  const vr = joiValidationService.getValidationResult(v, schema, 'objName')
  expect(vr.value.a1).toBe('ff')
  expect(vr.error).toBeInstanceOf(JoiValidationError)
  expect(vr.error).toMatchSnapshot()
})

test('getValidationResult valid', async () => {
  const vr = joiValidationService.getValidationResult('asd', stringSchema)
  expect(vr.error).toBeUndefined()
})

test('validationErrorToString', async () => {
  expect(joiValidationService.validationErrorToString(undefined as any)).toBeUndefined()
})

test('error should contain errorItems', async () => {
  const v = {
    a1: ' ff ', // to be converted
    a2: 'a', // invalid!
  }
  const { error } = joiValidationService.getValidationResult(v, schema, 'objName')
  expect(error!.data).toMatchSnapshot()
})

// optional
// default values
