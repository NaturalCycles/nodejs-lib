import { _filterNullishValues, _isObject } from '@naturalcycles/js-lib'
import Ajv, { ValidateFunction } from 'ajv'
import { AjvValidationError } from './ajvValidationError'

export interface AjvValidationOptions {
  objectName?: string
  objectId?: string

  /**
   * @default to cfg.logErrors, which defaults to false
   */
  logErrors?: boolean
}

export interface AjvSchemaCfg {
  /**
   * Pass Ajv instance, otherwise Ajv will be created with
   * AjvSchema default (not the same as Ajv defaults) parameters
   */
  ajv?: Ajv

  objectName?: string

  /**
   * @default false
   */
  logErrors?: boolean
}

/**
 * @experimental
 */
export class AjvSchema<T = unknown> {
  constructor(schema: any, private cfg: AjvSchemaCfg = {}) {
    this.ajv =
      cfg.ajv ||
      new Ajv({
        // default Ajv configuration!
        removeAdditional: true,
        allErrors: true,
        // verbose: true,
      })
    this.validateFunction = this.ajv.compile<T>(schema)
  }

  private readonly ajv: Ajv
  private readonly validateFunction: ValidateFunction<T>

  validate(obj: T, opt: AjvValidationOptions = {}): void {
    const err = this.getValidationError(obj, opt)
    if (err) throw err
  }

  getValidationError(obj: T, opt: AjvValidationOptions = {}): AjvValidationError | undefined {
    if (this.isValid(obj)) return

    const errors = this.validateFunction.errors!

    const {
      objectId = _isObject(obj) ? (obj['id'] as string) : undefined,
      objectName = this.cfg.objectName,
      logErrors = this.cfg.logErrors,
    } = opt
    const name = [objectName || 'Object', objectId].filter(Boolean).join('.')

    const message = this.ajv.errorsText(errors, {
      dataVar: name,
    })

    if (logErrors) {
      console.log(errors)
    }

    return new AjvValidationError(
      message,
      _filterNullishValues({
        errors,
        userFriendly: true,
        objectName,
        objectId,
      }),
    )
  }

  isValid(obj: T): boolean {
    return this.validateFunction(obj)
  }
}
