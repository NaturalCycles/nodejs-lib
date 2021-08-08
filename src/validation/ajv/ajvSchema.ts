import {
  _filterNullishValues,
  _isObject,
  _stringifyAny,
  _substringBefore,
} from '@naturalcycles/js-lib'
import Ajv, { ValidateFunction } from 'ajv'
import { AjvValidationError } from './ajvValidationError'
import { getAjv } from './getAjv'

export interface AjvValidationOptions {
  objectName?: string
  objectId?: string

  /**
   * @default to cfg.logErrors, which defaults to true
   */
  logErrors?: boolean

  /**
   * Used to separate multiple validation errors.
   *
   * @default cfg.separator || '\n'
   */
  separator?: string
}

export interface AjvSchemaCfg {
  /**
   * Pass Ajv instance, otherwise Ajv will be created with
   * AjvSchema default (not the same as Ajv defaults) parameters
   */
  ajv: Ajv

  /**
   * Dependent schemas to pass to Ajv instance constructor.
   * Simpler than instantiating and passing ajv instance yourself.
   */
  schemas?: any[]

  objectName?: string

  /**
   * Used to separate multiple validation errors.
   *
   * @default '\n'
   */
  separator: string

  /**
   * @default true
   */
  logErrors: boolean
}

/**
 * @experimental
 */
export class AjvSchema<T = unknown> {
  constructor(schema: any, cfg: Partial<AjvSchemaCfg> = {}) {
    this.cfg = {
      logErrors: true,
      separator: '\n',
      ...cfg,
      ajv:
        cfg.ajv ||
        getAjv({
          schemas: cfg.schemas,
          // verbose: true,
        }),
      // Auto-detecting "ObjectName" from $id of the schema (e.g "Address.schema.json")
      objectName: cfg.objectName || schema.$id ? _substringBefore(schema.$id, '.') : undefined,
    }

    this.validateFunction = this.cfg.ajv.compile<T>(schema)
  }

  private readonly cfg: AjvSchemaCfg
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
      separator = this.cfg.separator,
    } = opt
    const name = [objectName || 'Object', objectId].filter(Boolean).join('.')

    let message = this.cfg.ajv.errorsText(errors, {
      dataVar: name,
      separator,
    })

    const strValue = _stringifyAny(obj, { maxLen: 1000 })
    message = [message, 'Input: ' + strValue].join(separator)

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
