import { AppError, ErrorData } from '@naturalcycles/js-lib'
import { ValidationErrorItem } from 'joi'

export interface JoiValidationErrorData extends ErrorData {
  joiValidationErrorItems: ValidationErrorItem[]
}

export class JoiValidationError extends AppError<JoiValidationErrorData> {
  constructor (message: string, data: JoiValidationErrorData) {
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
        value: new Error().stack,
      })
    }
  }
}
