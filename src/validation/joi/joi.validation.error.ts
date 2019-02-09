import { AppError } from '@naturalcycles/js-lib'
import { ErrorData } from '@naturalcycles/js-lib'
import { ValidationErrorItem } from 'joi'

export interface JoiValidationErrorData extends ErrorData {
  joiValidationErrorItems: ValidationErrorItem[]
}

export class JoiValidationError extends AppError<JoiValidationErrorData> {
  constructor (message: string, data: JoiValidationErrorData) {
    super(message, data)
  }
}
