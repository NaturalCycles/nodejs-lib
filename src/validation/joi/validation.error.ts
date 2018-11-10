import { AppError } from '@naturalcycles/js-lib'

export class AppValidationError extends AppError {
  constructor (message: string, data?: any) {
    super(message, data)
  }
}
