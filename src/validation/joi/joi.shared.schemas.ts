import { Joi } from './joi.extensions'
import {
  AnySchemaTyped,
  ArraySchemaTyped,
  BooleanSchemaTyped,
  ObjectSchemaTyped,
  StringSchemaTyped,
} from './joi.model'

// Should all booleans be optional as a convention? So undefined will be just treated as false?
export const booleanSchema = Joi.boolean() as BooleanSchemaTyped
export const stringSchema = Joi.string()
export const numberSchema = Joi.number()
export const integerSchema = Joi.number().integer()
export const dateStringSchema = stringSchema.dateString()
export const binarySchema = Joi.binary()
export const urlSchema = (scheme: string | string[] = 'https') =>
  Joi.string().uri({ scheme }) as StringSchemaTyped

export function arraySchema<T>(items?: AnySchemaTyped<T, T>): ArraySchemaTyped<T> {
  return items ? Joi.array().items(items) : Joi.array()
}

export function objectSchema<IN, OUT = IN>(
  schema?: { [key in keyof Partial<IN>]: AnySchemaTyped<IN[key]> },
): ObjectSchemaTyped<IN, OUT> {
  return Joi.object(schema)
}

export const anySchema = Joi.any()
export const anyObjectSchema = Joi.object().options({ stripUnknown: false })

// 1g498efj5sder3324zer
/**
 * [a-z0-9_]*
 * 6-16 length
 */
export const idSchema = stringSchema
  .regex(/^[a-z0-9_]*$/)
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

export const emailSchema = stringSchema
  .email({
    tlds: false,
  })
  .lowercase()

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
