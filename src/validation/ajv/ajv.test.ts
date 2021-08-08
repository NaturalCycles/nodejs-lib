import { JsonSchema } from '@naturalcycles/common-type'
import { deepFreeze } from '@naturalcycles/dev-lib/dist/testing'
import { _stringifyAny, _try } from '@naturalcycles/js-lib'
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
  expect(() => schema.validate(missing)).toThrowErrorMatchingInlineSnapshot(`
    "Object must have required property 's'
    Input: {}"
  `)

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
  expect(() => schema.validate(missing, { objectName: 'Simple', objectId: 'id1' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Simple.id1 must have required property 's'
    Input: {}"
  `)

  // Object name without id from options
  expect(() => schema.validate(missing, { objectName: 'Simple' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Simple must have required property 's'
    Input: {}"
  `)

  // Object id from object
  expect(() => schema.validate({ id: 'id2' } as any)).toThrowErrorMatchingInlineSnapshot(`
    "Object.id2 must have required property 's'
    Input: {
      \\"id\\": \\"id2\\"
    }"
  `)

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
TestType must have required property 's2'
Input: {
  \\"s\\": \\"s\\"
}"
`)

  const invalid2 = {
    s: 's',
    n: null,
  } as TestType
  expect(() => schema.validate(invalid2)).toThrowErrorMatchingInlineSnapshot(`
"TestType must have required property 's2'
Input: {
  \\"s\\": \\"s\\",
  \\"n\\": null
}"
`)
})

// todo:
// custom: unixTimestamp
// email TLD! (as in Joi)
// email should lowercase itself! But how? No, it should only transform Inputs, but not "data in rest"
// url format (require https?)
// id? custom regex format
// check other standard joi schemas that we currently support

test.each([
  [{ type: 'string' }, ['', 'lo']],
  [{ type: 'string', format: 'email' }, ['a@b.com']],
  [{ type: 'string', format: 'date' }, ['1984-06-21']], // exactly same as our IsoDate
  [{ type: 'string', format: 'url' }, ['http://ya.ru']],
  [{ type: 'string', format: 'ipv4' }, ['1.1.1.1']],
  [{ type: 'string', format: 'regex' }, ['abc', '^abc$']],
  [{ type: 'string', format: 'uuid' }, ['123e4567-e89b-12d3-a456-426614174000']],
  [{ type: 'string', format: 'byte' }, ['aGVsbG8gd29ybGQ=']],
  [{ type: 'string', format: 'binary' }, ['any string']],
  [{ type: 'string', format: 'password' }, ['any string']],
  [{ type: 'number' }, [1, -5, 1059]],
  [{ type: 'integer' }, [1, -5, 1059]],
  [{ type: 'number', format: 'int32' }, [1, 1059]],
  [{ type: 'number', format: 'int64' }, [1, 1059]],
  [{ type: 'number', format: 'float' }, [1.1]],
  [{ type: 'number', format: 'double' }, [1.1]],
  // custom
  [{ type: 'string', format: 'id' }, ['abcd12']],
  [{ type: 'string', format: 'slug' }, ['hello-world']],
  [{ type: 'string', format: 'semVer' }, ['1.2.30']],
  [{ type: 'string', format: 'languageTag' }, ['en', 'en-US', 'sv-SE']],
  [{ type: 'string', format: 'countryCode' }, ['SE', 'US']],
  [{ type: 'string', format: 'currency' }, ['SEK', 'USD']],
  [{ type: 'number', format: 'unixTimestamp' }, [1232342342]],
  [{ type: 'number', format: 'unixTimestampMillis' }, [1232342342 * 1000]],
  [{ type: 'number', format: 'utcOffset' }, [-14 * 60, -12 * 60, 0, 12 * 60, 14 * 60]],
  [{ type: 'number', format: 'utcOffsetHours' }, [-14, -12, 0, 12, 14]],
] as [JsonSchema, any[]][])('%s should be valid', (schema, objects: any[]) => {
  const ajvSchema = new AjvSchema(schema)
  objects.forEach(obj => {
    // should not throw
    ajvSchema.validate(obj)
  })
})

test.each([
  [{ type: 'string' }, [undefined, null, 4, () => {}, NaN]],
  [{ type: 'string', format: 'email' }, ['', 'lo', 'a@b', 'a@b.com.']],
  [{ type: 'string', format: 'date' }, ['1984-06-2', '1984-6-21', '1984-06-21T']],
  [{ type: 'string', format: 'url' }, ['http://ya.r', 'ya.ru', 'abc://a.ru']],
  [{ type: 'string', format: 'ipv4' }, ['1.1.1.']],
  [{ type: 'string', format: 'regex' }, ['[', '[]++']],
  [{ type: 'string', format: 'uuid' }, ['123e4567-e89b-12d3-a456-4266141740']],
  [{ type: 'string', format: 'byte' }, ['123']],
  [{ type: 'number' }, ['1']],
  [{ type: 'integer' }, [1.1]],
  [{ type: 'number', format: 'int32' }, [Number.MAX_VALUE, 1.1]],
  [{ type: 'number', format: 'float' }, [Number.POSITIVE_INFINITY]],
  [{ type: 'number', format: 'double' }, [Number.NaN]],
  // custom
  [{ type: 'string', format: 'id' }, ['short', 's'.repeat(65), 'Aasdasasd']],
  [{ type: 'string', format: 'slug' }, ['hello_world']],
  [{ type: 'string', format: 'semVer' }, ['1.2']],
  [{ type: 'string', format: 'languageTag' }, ['en-U', 'en_US', 'sv_SE']],
  [{ type: 'string', format: 'countryCode' }, ['se', 'sve']],
  [{ type: 'string', format: 'currency' }, ['sek', 'us']],
  [{ type: 'number', format: 'unixTimestamp' }, [1232342342000, -1]],
  [{ type: 'number', format: 'unixTimestampMillis' }, [-1]],
  [{ type: 'number', format: 'utcOffset' }, [-15 * 60]],
  [{ type: 'number', format: 'utcOffsetHours' }, [-15, 15]],
] as [JsonSchema, any[]][])('%s should be invalid', (schema, objects: any[]) => {
  const ajvSchema = new AjvSchema(schema)
  objects.forEach(obj => {
    if (ajvSchema.isValid(obj)) {
      console.log(obj, 'should be invalid for schema:', schema)
      throw new Error(`${_stringifyAny(obj)} should be invalid for ${_stringifyAny(schema)}`)
    }
  })
})

test('default string', () => {
  const schema = new AjvSchema({
    type: 'object',
    properties: {
      s: {
        type: 'string',
        default: 'def',
      },
    },
  } as JsonSchema)

  const obj1 = { s: 's' }
  deepFreeze(obj1)
  schema.validate(obj1)

  const obj2 = {}
  schema.validate(obj2)
  expect(obj2).toEqual({ s: 'def' })
})

test('default object', () => {
  const schema = new AjvSchema({
    type: 'object',
    properties: {
      o: {
        type: 'object',
        properties: {
          hello: { type: 'string' },
          also: {},
        },
        default: { hello: 'world', also: { n: 1 } },
        additionalProperties: false,
      },
    },
  } as JsonSchema)

  const obj1 = { o: {} }
  deepFreeze(obj1)
  schema.validate(obj1)

  // Additional props should be removed
  const obj2 = { o: { extra: 123 } }
  schema.validate(obj2)
  expect(obj2).toEqual({ o: {} })

  const obj3 = {}
  schema.validate(obj3)
  expect(obj3).toEqual({ o: { hello: 'world', also: { n: 1 } } })
})

test('transform string', () => {
  const schema = new AjvSchema({
    type: 'object',
    properties: {
      s: {
        type: 'string',
        transform: ['trim', 'toLowerCase'],
      },
    },
  } as JsonSchema)

  const obj1 = { s: 's' }
  deepFreeze(obj1)
  schema.validate(obj1)

  const obj2 = { s: '   lo Lo lO' }
  schema.validate(obj2)
  expect(obj2).toEqual({ s: 'lo lo lo' })
})
