import { Joi } from './joi.extensions'
import { AnySchemaT, ArraySchemaTyped, BooleanSchemaTyped, ObjectSchemaTyped } from './joi.model'

// Should all booleans be optional as a convention? So undefined will be just treated as false?
export const booleanSchema = Joi.boolean() as BooleanSchemaTyped
export const stringSchema = Joi.string()
export const numberSchema = Joi.number()
export const integerSchema = Joi.number().integer()
export const dateStringSchema = stringSchema.dateString()
export const binarySchema = Joi.binary()

export function arraySchema<T> (items?: AnySchemaT<T>): ArraySchemaTyped<T> {
  return items ? Joi.array().items(items) : Joi.array()
}

export function objectSchema<T> (
  schema?: { [key in keyof T]: AnySchemaT<T[key]> },
): ObjectSchemaTyped<T> {
  return Joi.object(schema)
}

export const anySchema = Joi.any()
export const anyObjectSchema = Joi.object().options({ stripUnknown: false })

// 1g498efj5sder3324zer
export const idSchema = stringSchema
  .alphanum()
  .lowercase()
  .min(6)
  .max(64)

/**
 * `_` should NOT be allowed to be able to use slug-ids as part of natural ids with `_` separator.
 */
export const SLUG_PATTERN = /^[a-z0-9-]*$/

/**
 * "Slug" - a valid URL, filename, etc.
 */
export const slugSchema = stringSchema
  .regex(SLUG_PATTERN)
  .min(1)
  .max(255)

// 16725225600 is 2500-01-01
export const unixTimestampSchema = numberSchema
  .integer()
  .min(0)
  .max(16725225600)

// 2
export const verSchema = numberSchema
  .optional()
  .integer()
  .min(1)
  .max(100)

export const emailSchema = stringSchema.email().lowercase()

/**
 * Pattern is simplified for our use, it's not a canonical SemVer.
 */
export const SEM_VER_PATTERN = /^[0-9]+\.[0-9]+\.[0-9]+$/
export const semVerSchema = stringSchema.regex(SEM_VER_PATTERN)
// todo: .error(() => 'should be SemVer')

export const userAgentSchema = stringSchema.min(10).max(400)

export const utcOffsetSchema = numberSchema
  .min(-14 * 60)
  .max(14 * 60)
  .dividable(15)

// todo: we used to have format as "192.168.0.1/192.168.0.2" (slash with provided X-Forwarded-For value)
// maybe it'll break this validation
export const ipAddressSchema = stringSchema.ip()
