import { AppError, ErrorData } from '@naturalcycles/js-lib'
import { ValidationErrorItem } from 'joi'

/**
 * Example of ValidationErrorItem:
 *
 * {
 *   message: '"temperature" must be larger than or equal to 33',
 *   path: [ 'entries', 10, 'temperature' ],
 *   type: 'number.min',
 *   context: { limit: 33, value: 30, key: 'temperature', label: 'temperature' }
 * }
 */
export interface JoiValidationErrorData extends ErrorData {
  joiValidationErrorItems: ValidationErrorItem[]
  joiValidationObjectName?: string
  joiValidationObjectId?: string
  /**
   * Error "annotation" is stripped in Error.message.
   * This field contains the "full" annotation.
   */
  annotation?: string
}

export class JoiValidationError extends AppError<JoiValidationErrorData> {
  constructor(message: string, data: JoiValidationErrorData) {
    super(message, data)

    this.constructor = JoiValidationError
    ;(this as any).__proto__ = JoiValidationError.prototype
    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
    })

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      Object.defineProperty(this, 'stack', {
        value: new Error().stack, //  eslint-disable-line unicorn/error-message
      })
    }
  }
}
