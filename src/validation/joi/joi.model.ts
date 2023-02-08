import {
  AlternativesSchema,
  AnySchema,
  ArraySchema,
  BinarySchema,
  BooleanSchema,
  DateSchema,
  FunctionSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'joi'

/* eslint-disable unused-imports/no-unused-vars */

export type SchemaTyped<IN, OUT = IN> =
  | AnySchemaTyped<IN, OUT>
  | ArraySchemaTyped<IN>
  | AlternativesSchemaTyped<IN>
  | BinarySchemaTyped
  | BooleanSchemaTyped
  | DateSchemaTyped<IN>
  | FunctionSchemaTyped<IN>
  | NumberSchemaTyped
  | ObjectSchemaTyped<IN, OUT>
  | StringSchemaTyped

/**
 * IN - value before validation/conversion
 * OUT - value after validation/conversion (can be different due to conversion, stripping, etc)
 */
export interface AnySchemaTyped<IN, OUT = IN> extends AnySchema {}

export interface ArraySchemaTyped<T> extends ArraySchema, AnySchemaTyped<T[]> {}
export interface AlternativesSchemaTyped<T> extends AlternativesSchema {}
export interface BinarySchemaTyped extends BinarySchema, AnySchemaTyped<Buffer> {}
export interface BooleanSchemaTyped extends BooleanSchema, AnySchemaTyped<boolean> {}
export interface DateSchemaTyped<T> extends DateSchema {}
export interface FunctionSchemaTyped<T> extends FunctionSchema {}
export interface NumberSchemaTyped extends NumberSchema, AnySchemaTyped<number> {}
export interface ObjectSchemaTyped<IN, OUT = IN>
  extends ObjectSchema<IN>,
    AnySchemaTyped<IN, OUT> {}
export interface StringSchemaTyped extends StringSchema, AnySchemaTyped<string> {}

/**
 * This type is useful to allow "joi schema merging".
 * Because by default Joi doesn't allow normal merging.
 * E.g `joiSchema.concat` doesn't play well when some property exists
 * in both left and right side.
 */
export type JoiSchemaObject<T> = Partial<Record<keyof T, any>>
