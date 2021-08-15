import { testDir } from '../test/paths.cnst'
import { readAjvSchemas, readJsonSchemas } from './ajv/ajv.util'

const schemaDir = `${testDir}/schema`

test('readJsonSchemas', () => {
  const schemas = readJsonSchemas(`${schemaDir}/**/*.schema.json`)
  const schemaNames = schemas.map(s => s.$id)
  expect(schemaNames).toMatchInlineSnapshot(`
Array [
  "TestType.schema.json",
  "simple.schema.json",
]
`)
})

test('readAjvSchemas', () => {
  const schemas = readAjvSchemas(`${schemaDir}/**/*.schema.json`)
  const schemaNames = schemas.map(s => s.cfg.objectName)
  expect(schemaNames).toMatchInlineSnapshot(`
Array [
  "TestType",
  "simple",
]
`)
})
