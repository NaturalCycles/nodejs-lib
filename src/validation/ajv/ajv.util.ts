import * as fs from 'fs'
import { JsonSchema } from '@naturalcycles/js-lib'
import { GlobbyOptions } from 'globby'
import * as globby from 'globby'
import { AjvSchema, AjvSchemaCfg } from './ajvSchema'

/**
 * Does fs.readFileSync + JSON.parse for ALL files matching the passed `glob` pattern.
 * E.g `someDir/**\/*.schema.json`
 *
 * Returns them as an array of JsonSchema.
 *
 * @experimental
 */
export function readJsonSchemas(patterns: string | string[], opt?: GlobbyOptions): JsonSchema[] {
  return globby.sync(patterns, opt).map(fileName => JSON.parse(fs.readFileSync(fileName, 'utf-8')))
}

/**
 * Reads json schemas from given dir (glob pattern).
 * Creates new AjvSchema for each of them (ajv validates them upon creation).
 * Passes `schemas` option to ajv, so, schemas may $ref each other and it'll be fine.
 *
 * @experimental
 */
export function readAjvSchemas(patterns: string | string[], cfg?: AjvSchemaCfg): AjvSchema[] {
  const schemas = readJsonSchemas(patterns)
  return schemas.map(schema =>
    AjvSchema.create(schema, {
      schemas,
      ...cfg,
    }),
  )
}
