import { arraySchema, objectSchema, stringSchema } from './joi.shared.schemas'
import { JoiValidationError } from './joi.validation.error'
import { getValidationResult, validate, validationErrorToString } from './joi.validation.util'

interface Obj1 {
  a1: string
  a2?: string
}

const obj1Schema = objectSchema({
  a1: stringSchema.min(2).max(5),
  a2: stringSchema.min(2).optional(),
})

interface Obj2 {
  s1?: string
  a: Obj1[]
}

const obj2Schema = objectSchema({
  s1: stringSchema.optional(),
  a: arraySchema.items(obj1Schema),
})

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
    expect(() => validate(v, obj1Schema)).toThrowErrorMatchingSnapshot()
  })
})

test('should pass on valid values', () => {
  validValues.forEach(v => {
    validate(v, obj1Schema)
  })
})

test('should trim strings by default', async () => {
  const v = { a1: ' sdf ' }
  const v2 = validate(v, obj1Schema)

  expect(v2.a1).toBe('sdf')
  expect(v === v2).toBeFalsy() // object should be cloned
})

test('should strip unknown keys', async () => {
  const v = {
    a1: 'ff',
    unk: 'ddd',
  }
  const v2 = validate(v, obj1Schema)

  expect(v2).toEqual({ a1: 'ff' })
  expect(v2.unk).toBeUndefined()
})

test('getValidationResult should still convert', async () => {
  const v = {
    a1: ' ff ', // to be converted
    a2: 'a', // invalid!
  }
  const vr = getValidationResult(v, obj1Schema, 'objName')
  expect(vr.value.a1).toBe('ff')
  expect(vr.error).toBeInstanceOf(JoiValidationError)
  expect(vr.error).toMatchSnapshot()
})

test('getValidationResult valid', async () => {
  const vr = getValidationResult('asd', stringSchema)
  expect(vr.error).toBeUndefined()
})

test('validationErrorToString', async () => {
  expect(validationErrorToString(undefined as any)).toBeUndefined()
})

test('error should contain errorItems', async () => {
  const v = {
    a1: ' ff ', // to be converted
    a2: 'a', // invalid!
  }
  const { error } = getValidationResult(v, obj1Schema, 'objName')
  expect(error!.data).toMatchSnapshot()
})

test('array items with unknown props', async () => {
  const v: Obj2 = {
    a: [
      {
        a1: 'hello',
        unk: 'unk', // unknown property!
      } as Obj1,
    ],
  }

  const { value, error } = getValidationResult(v, obj2Schema)
  // console.log(value)
  expect(error).toBeUndefined()

  // Expect 'unk' to be stripped away, no validation error
  expect(value).toEqual({
    a: [{ a1: 'hello' }],
  })
})

test('array with invalid items', async () => {
  const v: Obj2 = {
    a: [
      {
        a1: 'hello',
      } as Obj1,
      '' as any, // invalid value
    ],
  }

  const { error } = getValidationResult(v, obj2Schema)
  // console.log(value)
  expect(error!.data).toMatchSnapshot()
})

test('array items with invalid props', async () => {
  const v: Obj2 = {
    a: [
      {
        a1: 5, // invalid type
      } as any,
    ],
  }

  const { error } = getValidationResult(v, obj2Schema)
  expect(error!.data).toMatchSnapshot()
})

// optional
// default values

test('long message string', () => {
  const objSchema = arraySchema.items(
    objectSchema({
      a: stringSchema,
    }),
  )

  const longObject = Array(1000).fill({ a: 5 })

  const { error } = getValidationResult(longObject, objSchema)
  // console.log(error!.message, error!.message.length)
  expect(error!.message).toMatchSnapshot()
})
