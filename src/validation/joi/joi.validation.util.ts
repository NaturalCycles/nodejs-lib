/*
 * Does 2 things:
 * 1. Validates the value according to Schema passed.
 * 2. Converts the value (also according to Schema).
 *
 * "Converts" mean e.g trims all strings from leading/trailing spaces.
 */

import { SchemaLike, ValidationError, ValidationOptions } from 'joi'
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
    throw new JoiValidationError(validationErrorToString(error, objectName), {
      joiValidationErrorItems: error.details,
    })
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
    vr.error = new JoiValidationError(validationErrorToString(error, objectName), {
      joiValidationErrorItems: error.details,
    })
  }

  return vr
}

export function validationErrorToString (err: ValidationError, objectName?: string): string {
  if (!err) return undefined as any
  const tokens: string[] = []
  if (objectName) tokens.push(objectName)

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

  return tokens.join('\n')
}
