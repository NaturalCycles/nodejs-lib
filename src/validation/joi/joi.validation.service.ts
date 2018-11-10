import { SchemaLike, ValidationError, ValidationOptions } from 'joi'
import { Joi } from './joi.extensions'
import { AppValidationError } from './validation.error'

export interface ValidationResult<T = any> {
  value: T
  error?: AppValidationError
}

const defaultOptions: ValidationOptions = {
  abortEarly: false,
  convert: true,
  allowUnknown: true,
  stripUnknown: {
    objects: true,
    arrays: true, // let's be very careful with that! https://github.com/hapijs/joi/issues/658
  },
  presence: 'required',
}

/**
 * Does 2 things:
 * 1. Validates the value according to Schema passed.
 * 2. Converts the value (also according to Schema).
 *
 * "Converts" mean e.g trims all strings from leading/trailing spaces.
 */
class JoiValidationService {
  /**
   * Validates with Joi.
   * Throws AppValidationError if invalid.
   * Returns *converted* value.
   */
  validate<T> (
    value: T,
    schema: SchemaLike,
    objectName?: string,
    options: ValidationOptions = {},
  ): T {
    const r = Joi.validate(value, schema, { ...defaultOptions, ...options })

    if (r.error) {
      throw new AppValidationError(this.validationErrorToString(r.error, objectName))
    }

    return r.value
  }

  /**
   * Validates with Joi.
   * Returns ValidationResult with converted value and error (if any).
   * Does not throw.
   */
  getValidationResult<T> (
    value: T,
    schema: SchemaLike,
    objectName?: string,
    options: ValidationOptions = {},
  ): ValidationResult<T> {
    const r = Joi.validate(value, schema, { ...defaultOptions, ...options })

    const vr: ValidationResult<T> = {
      value: r.value,
    }

    if (r.error) {
      vr.error = new AppValidationError(this.validationErrorToString(r.error, objectName))
    }

    return vr
  }

  validationErrorToString (err: ValidationError, objectName?: string): string {
    if (!err) return undefined as any
    let msg = ''
    if (objectName) msg += objectName + '\n'

    // Strip colors in production (for e.g Sentry reporting)
    const stripColors = process.env.NODE_ENV === 'production'
    msg += (err.annotate as any)(stripColors) // typings are not up-to-date, hence "as any"
    return msg
  }
}

export const joiValidationService = new JoiValidationService()
