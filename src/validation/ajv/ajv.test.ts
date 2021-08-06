import { _try } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import { testDir } from '../../test/paths.cnst'
import { AjvSchema } from './ajvSchema'
import { AjvValidationError } from './ajvValidationError'

interface Simple {
  s: string
  int?: number
}

interface TestType {
  s: string
  n: null
  s2: string | null
}

const simpleSchema = fs.readJsonSync(`${testDir}/schema/simple.schema.json`)
const testTypeSchema = fs.readJsonSync(`${testDir}/schema/TestType.schema.json`)

test('simple', () => {
  const schema = new AjvSchema<Simple>(simpleSchema)

  // Valid
  const valid: Simple = { s: 's' }
  schema.validate(valid)
  schema.validate({ s: '' })
  schema.validate({ s: 's', int: 5 })
  expect(schema.isValid(valid)).toBe(true)
  expect(schema.getValidationError(valid)).toBeUndefined()

  // Should remove additonal
  const a = { s: 's', extra: 1 }
  schema.validate(a)
  expect(a).toEqual({ s: 's' }) // extra removed, no error

  // Error, required property
  const missing = {} as Simple
  expect(schema.isValid(missing)).toBe(false)
  expect(() => schema.validate(missing)).toThrowErrorMatchingInlineSnapshot(
    `"Object must have required property 's'"`,
  )

  const [err] = _try(() => schema.validate(missing))
  expect(err).toBeInstanceOf(AjvValidationError)
  expect((err as AjvValidationError).data).toMatchInlineSnapshot(`
    Object {
      "errors": Array [
        Object {
          "instancePath": "",
          "keyword": "required",
          "message": "must have required property 's'",
          "params": Object {
            "missingProperty": "s",
          },
          "schemaPath": "#/required",
        },
      ],
      "userFriendly": true,
    }
  `)

  // Object name, id from options
  expect(() =>
    schema.validate(missing, { objectName: 'Simple', objectId: 'id1' }),
  ).toThrowErrorMatchingInlineSnapshot(`"Simple.id1 must have required property 's'"`)

  // Object name without id from options
  expect(() =>
    schema.validate(missing, { objectName: 'Simple' }),
  ).toThrowErrorMatchingInlineSnapshot(`"Simple must have required property 's'"`)

  // Object id from object
  expect(() => schema.validate({ id: 'id2' } as any)).toThrowErrorMatchingInlineSnapshot(
    `"Object.id2 must have required property 's'"`,
  )

  // logErrors
  _try(() => schema.validate(missing, { logErrors: true }))
})

test('TestType', () => {
  const schema = new AjvSchema<TestType>(testTypeSchema)

  // Valid
  const valid: TestType = {
    s: 's',
    n: null,
    s2: 's2',
  }
  const valid2: TestType = {
    s: 's',
    n: null,
    s2: null,
  }

  schema.validate(valid)
  schema.validate(valid2)

  const invalid1 = {
    s: 's',
  } as TestType
  expect(() => schema.validate(invalid1)).toThrowErrorMatchingInlineSnapshot(`
    "TestType must have required property 'n'
    TestType must have required property 's2'"
  `)

  const invalid2 = {
    s: 's',
    n: null,
  } as TestType
  expect(() => schema.validate(invalid2)).toThrowErrorMatchingInlineSnapshot(
    `"TestType must have required property 's2'"`,
  )
})
