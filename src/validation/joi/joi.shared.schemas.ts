import { BaseDBEntity, SavedDBEntity } from '@naturalcycles/js-lib'
import { Joi } from './joi.extensions'
import {
  AlternativesSchemaTyped,
  AnySchemaTyped,
  ArraySchemaTyped,
  BooleanSchemaTyped,
  ObjectSchemaTyped,
  StringSchemaTyped,
} from './joi.model'

export const booleanSchema = Joi.boolean() as BooleanSchemaTyped
export const booleanDefaultToFalseSchema = Joi.boolean().default(false) as BooleanSchemaTyped
export const stringSchema = Joi.string()
export const numberSchema = Joi.number()
export const integerSchema = Joi.number().integer()
export const percentageSchema = Joi.number().integer().min(0).max(100)
export const dateStringSchema = stringSchema.dateString()
export const binarySchema = Joi.binary()
export const dateObjectSchema = Joi.object().instance(Date)

export const urlSchema = (scheme: string | string[] = 'https'): StringSchemaTyped =>
  Joi.string().uri({ scheme })

export function arraySchema<T>(items?: AnySchemaTyped<T, T>): ArraySchemaTyped<T> {
  return items ? Joi.array().items(items) : Joi.array()
}

export function objectSchema<IN, OUT = IN>(schema?: {
  [key in keyof Partial<IN>]: AnySchemaTyped<IN[key]>
}): ObjectSchemaTyped<IN, OUT> {
  return Joi.object(schema)
}

export function oneOfSchema<T = any>(
  ...schemas: AnySchemaTyped<any>[]
): AlternativesSchemaTyped<T> {
  return Joi.alternatives(schemas)
}

export const anySchema = Joi.any()
export const anyObjectSchema = Joi.object().options({ stripUnknown: false })

export const BASE62_REGEX = /^[a-zA-Z0-9]+$/
export const BASE64_REGEX = /^[A-Za-z0-9+/]+={0,2}$/
export const BASE64URL_REGEX = /^[\w-/]+$/
export const base62Schema = stringSchema.regex(BASE62_REGEX)
export const base64Schema = stringSchema.regex(BASE64_REGEX)
export const base64UrlSchema = stringSchema.regex(BASE64URL_REGEX)

export const JWT_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/
export const jwtSchema = stringSchema.regex(JWT_REGEX)

// 1g498efj5sder3324zer
/**
 * [a-zA-Z0-9_]*
 * 6-64 length
 */
export const idSchema = stringSchema.regex(/^[a-zA-Z0-9_]{6,64}$/)

export const idBase62Schema = base62Schema.min(8).max(64)
export const idBase64Schema = base64Schema.min(8).max(64)
export const idBase64UrlSchema = base64UrlSchema.min(8).max(64)

/**
 * `_` should NOT be allowed to be able to use slug-ids as part of natural ids with `_` separator.
 */
export const SLUG_REGEX = /^[a-z0-9-]*$/

/**
 * "Slug" - a valid URL, filename, etc.
 */
export const slugSchema = stringSchema.regex(SLUG_REGEX).min(1).max(255)

const TS_2500 = 16725225600 // 2500-01-01
const TS_2000 = 946684800 // 2000-01-01

/**
 * Between years 1970 and 2050
 */
export const unixTimestampSchema = numberSchema.integer().min(0).max(TS_2500)
/**
 * Between years 2000 and 2050
 */
export const unixTimestamp2000Schema = numberSchema.integer().min(0).min(TS_2000).max(TS_2500)
/**
 * Between years 1970 and 2050
 */
export const unixTimestampMillisSchema = numberSchema
  .integer()
  .min(0)
  .max(TS_2500 * 1000)
/**
 * Between years 2000 and 2050
 */
export const unixTimestampMillis2000Schema = numberSchema
  .integer()
  .min(TS_2000 * 1000)
  .max(TS_2500 * 1000)

// 2
export const verSchema = numberSchema.optional().integer().min(1).max(100)

/**
 * Be careful, by default emailSchema does TLD validation. To disable it - use `stringSchema.email({tld: false}).lowercase()`
 */
export const emailSchema = stringSchema.email().lowercase()

/**
 * Pattern is simplified for our use, it's not a canonical SemVer.
 */
export const SEM_VER_REGEX = /^[0-9]+\.[0-9]+\.[0-9]+$/
export const semVerSchema = stringSchema.regex(SEM_VER_REGEX)
// todo: .error(() => 'should be SemVer')

export const userAgentSchema = stringSchema
  .min(5) // I've seen UA of `Android` (7 characters)
  .max(400)

export const utcOffsetSchema = numberSchema
  .min(-14 * 60)
  .max(14 * 60)
  .dividable(15)

export const ipAddressSchema = stringSchema.ip()

export const baseDBEntitySchema = objectSchema<BaseDBEntity>({
  id: stringSchema.optional(),
  created: unixTimestamp2000Schema.optional(),
  updated: unixTimestamp2000Schema.optional(),
})

export const savedDBEntitySchema = objectSchema<SavedDBEntity>({
  id: stringSchema,
  created: unixTimestamp2000Schema,
  updated: unixTimestamp2000Schema,
})
