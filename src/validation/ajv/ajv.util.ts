import type { JsonSchema } from '@naturalcycles/js-lib'
import type { FastGlobOptions } from '../..'
import { fastGlob, fs2 } from '../..'
import type { AjvSchemaCfg } from './ajvSchema'
import { AjvSchema } from './ajvSchema'

/**
 * Does fs.readFileSync + JSON.parse for ALL files matching the passed `glob` pattern.
 * E.g `someDir/**\/*.schema.json`
 *
 * Returns them as an array of JsonSchema.
 *
 * @experimental
 */
export function readJsonSchemas(patterns: string | string[], opt?: FastGlobOptions): JsonSchema[] {
  return fastGlob.sync(patterns, opt).map(fileName => fs2.readJson(fileName))
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
