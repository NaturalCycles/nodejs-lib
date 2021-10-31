/*
 * Does 2 things:
 * 1. Validates the value according to Schema passed.
 * 2. Converts the value (also according to Schema).
 *
 * "Converts" mean e.g trims all strings from leading/trailing spaces.
 */

import { _hb, _isObject, _truncateMiddle } from '@naturalcycles/js-lib'
import { ValidationError, ValidationOptions } from 'joi'
import { AnySchemaTyped } from './joi.model'
import { JoiValidationError, JoiValidationErrorData } from './joi.validation.error'

// todo: consider replacing with Tuple of [error, value]
export interface JoiValidationResult<T = any> {
  value: T
  error?: JoiValidationError
}

// Strip colors in production (for e.g Sentry reporting)
// const stripColors = process.env.NODE_ENV === 'production' || !!process.env.GAE_INSTANCE
// Currently colors do more bad than good, so let's strip them always for now
const stripColors = true

const defaultOptions: ValidationOptions = {
  abortEarly: false,
  convert: true,
  allowUnknown: true,
  stripUnknown: {
    objects: true,
    // true: it will SILENTLY strip invalid values from arrays. Very dangerous! Can lead to data loss!
    // false: it will THROW validation error if any of array items is invalid
    // Q: is it invalid if it has unknown properties?
    // A: no, unknown properties are just stripped (in both 'false' and 'true' states), array is still valid
    // Q: will it strip or keep unknown properties in array items?..
    // A: strip
    arrays: false, // let's be very careful with that! https://github.com/hapijs/joi/issues/658
  },
  presence: 'required',
  // errors: {
  //   stack: true,
  // }
}

/**
 * Validates with Joi.
 * Throws JoiValidationError if invalid.
 * Returns *converted* value.
 *
 * If `schema` is undefined - returns value as is.
 */
export function validate<IN, OUT = IN>(
  value: IN,
  schema?: AnySchemaTyped<IN, OUT>,
  objectName?: string,
  options: ValidationOptions = {},
): OUT {
  const { value: returnValue, error } = getValidationResult<IN, OUT>(
    value,
    schema,
    objectName,
    options,
  )

  if (error) {
    throw error
  }

  return returnValue
}

/**
 * Validates with Joi.
 * Returns JoiValidationResult with converted value and error (if any).
 * Does not throw.
 *
 * If `schema` is undefined - returns value as is.
 */
export function getValidationResult<IN, OUT = IN>(
  value: IN,
  schema?: AnySchemaTyped<IN, OUT>,
  objectName?: string,
  options: ValidationOptions = {},
): JoiValidationResult<OUT> {
  if (!schema) return { value } as any

  const { value: returnValue, error } = schema.validate(value, {
    ...defaultOptions,
    ...options,
  })

  const vr: JoiValidationResult<OUT> = {
    value: returnValue as OUT,
  }

  if (error) {
    vr.error = createError(value, error, objectName)
  }

  return vr
}

/**
 * Convenience function that returns true if !error.
 */
export function isValid<IN, OUT = IN>(value: IN, schema?: AnySchemaTyped<IN, OUT>): boolean {
  if (!schema) return { value } as any

  const { error } = schema.validate(value, defaultOptions)
  return !error
}

export function undefinedIfInvalid<IN, OUT = IN>(
  value: IN,
  schema?: AnySchemaTyped<IN, OUT>,
): OUT | undefined {
  if (!schema) return { value } as any

  const { value: returnValue, error } = schema.validate(value, defaultOptions)

  return error ? undefined : returnValue
}

/**
 * Will do joi-convertation, regardless of error/validity of value.
 *
 * @returns converted value
 */
export function convert<IN, OUT = IN>(value: IN, schema?: AnySchemaTyped<IN, OUT>): OUT {
  if (!schema) return value as any
  const { value: returnValue } = schema.validate(value, defaultOptions)
  return returnValue
}

function createError(value: any, err: ValidationError, objectName?: string): JoiValidationError {
  if (!err) return undefined as any
  const tokens: string[] = []

  const objectId = _isObject(value) ? (value['id'] as string) : undefined

  if (objectId || objectName) {
    objectName = objectName || value?.constructor?.name

    tokens.push('Invalid ' + [objectName, objectId].filter(Boolean).join('.'))
  }

  const annotation = err.annotate(stripColors)

  if (annotation.length > 4000) {
    // Annotation message is too big and will be replaced by stringified `error.details` instead

    tokens.push(
      _truncateMiddle(annotation, 4000, `\n... ${_hb(annotation.length)} message truncated ...\n`),
    )

    // Up to 5 `details`
    tokens.push(...err.details.slice(0, 5).map(i => `${i.message} @ .${i.path.join('.')}`))

    if (err.details.length > 5) tokens.push(`... ${err.details.length} errors`)
  } else {
    tokens.push(annotation)
  }

  const msg = tokens.join('\n')

  const data: JoiValidationErrorData = {
    joiValidationErrorItems: err.details,
    ...(objectName && { joiValidationObjectName: objectName }),
    ...(objectId && { joiValidationObjectId: objectId }),
  }

  // Make annotation non-enumerable, to not get it automatically printed,
  // but still accessible
  Object.defineProperty(data, 'annotation', {
    writable: true,
    configurable: true,
    enumerable: false,
    value: annotation,
  })

  return new JoiValidationError(msg, data)
}
