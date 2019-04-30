/*
 * Does 2 things:
 * 1. Validates the value according to Schema passed.
 * 2. Converts the value (also according to Schema).
 *
 * "Converts" mean e.g trims all strings from leading/trailing spaces.
 */

import { SchemaLike, ValidationError, ValidationOptions } from '@hapi/joi'
import { isObject } from '@naturalcycles/js-lib'
import { Joi } from './joi.extensions'
import { JoiValidationError } from './joi.validation.error'

export interface JoiValidationResult<T = any> {
  value: T
  error?: JoiValidationError
}

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
}

/**
 * Validates with Joi.
 * Throws AppValidationError if invalid.
 * Returns *converted* value.
 */
export function validate<T> (
  value: T,
  schema: SchemaLike,
  objectName?: string,
  options: ValidationOptions = {},
): T {
  const { value: returnValue, error } = Joi.validate(value, schema, {
    ...defaultOptions,
    ...options,
  })

  if (error) {
    throw createError(value, error, objectName)
  }

  return returnValue
}

/**
 * Validates with Joi.
 * Returns ValidationResult with converted value and error (if any).
 * Does not throw.
 */
export function getValidationResult<T> (
  value: T,
  schema: SchemaLike,
  objectName?: string,
  options: ValidationOptions = {},
): JoiValidationResult<T> {
  const { value: returnValue, error } = Joi.validate(value, schema, {
    ...defaultOptions,
    ...options,
  })

  const vr: JoiValidationResult<T> = {
    value: returnValue,
  }

  if (error) {
    vr.error = createError(value, error, objectName)
  }

  return vr
}

function createError (value: any, err: ValidationError, objectName?: string): JoiValidationError {
  if (!err) return undefined as any
  const tokens: string[] = []

  const objectId = isObject(value) ? (value['id'] as string) : undefined

  if (objectId || objectName) {
    objectName = objectName || (value && value.constructor && value.constructor.name)

    tokens.push([objectName, objectId].filter(i => i).join('.'))
  }

  // Strip colors in production (for e.g Sentry reporting)
  const stripColors = process.env.NODE_ENV === 'production'
  const annotation: string = (err.annotate as any)(stripColors) // typings are not up-to-date, hence "as any"

  if (annotation.length > 5000) {
    // Annotation message is too big and will be replaced by stringified `error.details` instead
    tokens.push(
      annotation.substr(0, 500),
      `... ${Math.ceil(annotation.length / 1024)} KB message truncated`,
    )

    // Up to 5 `details`
    tokens.push(...err.details.slice(0, 5).map(i => `${i.message} @ .${i.path.join('.')}`))

    if (err.details.length > 5) tokens.push(`... ${err.details.length} errors`)
  } else {
    tokens.push(annotation)
  }

  const msg = tokens.join('\n')

  return new JoiValidationError(msg, {
    joiValidationErrorItems: err.details,
    ...(objectName && { joiValidationObjectName: objectName }),
    ...(objectId && { joiValidationObjectId: objectId }),
  })
}
