import {
  JsonSchema,
  JsonSchemaAnyBuilder,
  _filterNullishValues,
  _isObject,
  _substringBefore,
} from '@naturalcycles/js-lib'
import Ajv, { ValidateFunction } from 'ajv'
import * as fs from 'fs'
import { inspectAny, requireFileToExist } from '../../index'
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

  /**
   * Option of Ajv.
   * If set to true - will mutate your input objects!
   * Defaults to false.
   *
   * This option is a "shortcut" to skip creating and passing Ajv instance.
   */
  coerceTypes?: boolean
}

/**
 * On creation - compiles ajv validation function.
 * Provides convenient methods, error reporting, etc.
 *
 * @experimental
 */
export class AjvSchema<T = unknown> {
  constructor(schema: JsonSchema<T> | JsonSchemaAnyBuilder<T>, cfg: Partial<AjvSchemaCfg> = {}) {
    const s = schema instanceof JsonSchemaAnyBuilder ? schema.build() : schema

    this.cfg = {
      logErrors: true,
      separator: '\n',
      ...cfg,
      ajv:
        cfg.ajv ||
        getAjv({
          schemas: cfg.schemas,
          coerceTypes: cfg.coerceTypes || false,
          // verbose: true,
        }),
      // Auto-detecting "ObjectName" from $id of the schema (e.g "Address.schema.json")
      objectName: cfg.objectName || (s.$id ? _substringBefore(s.$id, '.') : undefined),
    }

    this.validateFunction = this.cfg.ajv.compile<T>(s)
  }

  /**
   * Create AjvSchema directly from a filePath of json schema.
   * Convenient method that just does fs.readFileSync for you.
   */
  static readJsonSync<T = unknown>(
    filePath: string,
    cfg: Partial<AjvSchemaCfg> = {},
  ): AjvSchema<T> {
    requireFileToExist(filePath)
    const schema = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return new AjvSchema<T>(schema, cfg)
  }

  readonly cfg: AjvSchemaCfg
  private readonly validateFunction: ValidateFunction<T>

  /**
   * It returns the original object just for convenience.
   * Reminder: Ajv will MUTATE your object under 2 circumstances:
   * 1. `useDefaults` option (enabled by default!), which will set missing/empty values that have `default` set in the schema.
   * 2. `coerceTypes` (false by default).
   *
   * Returned object is always the same object (`===`) that was passed, so it is returned just for convenience.
   */
  validate(obj: T, opt: AjvValidationOptions = {}): T {
    const err = this.getValidationError(obj, opt)
    if (err) throw err
    return obj
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

    const strValue = inspectAny(obj, { maxLen: 1000 })
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
