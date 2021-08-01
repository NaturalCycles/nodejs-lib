import { AppError, ErrorData } from '@naturalcycles/js-lib'
import type { ErrorObject } from 'ajv'

export interface AjvValidationErrorData extends ErrorData {
  errors: ErrorObject[]
  objectName?: string
  objectId?: string
}

export class AjvValidationError extends AppError<AjvValidationErrorData> {
  constructor(message: string, data: AjvValidationErrorData) {
    super(message, data)

    this.constructor = AjvValidationError
    ;(this as any).__proto__ = AjvValidationError.prototype
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
