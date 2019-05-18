import {
  AlternativesSchema,
  AnySchema,
  ArraySchema,
  BinarySchema,
  BooleanSchema,
  DateSchema,
  FunctionSchema,
  LazySchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from '@hapi/joi'

export type SchemaTyped<IN, OUT = IN> =
  | AnySchemaT<IN, OUT>
  | ArraySchemaTyped<IN>
  | AlternativesSchemaTyped<IN>
  | BinarySchemaTyped
  | BooleanSchemaTyped
  | DateSchemaTyped<IN>
  | FunctionSchemaTyped<IN>
  | NumberSchemaTyped
  | ObjectSchemaTyped<IN, OUT>
  | StringSchemaTyped
  | LazySchemaTyped<IN>

/**
 * IN - value before validation/conversion
 * OUT - value after validation/conversion (can be different due to conversion, stripping, etc)
 */
export interface AnySchemaT<IN, OUT = IN> extends AnySchema {}

export interface ArraySchemaTyped<T> extends ArraySchema, AnySchemaT<T[]> {}
export interface AlternativesSchemaTyped<T> extends AlternativesSchema {}
export interface BinarySchemaTyped extends BinarySchema, AnySchemaT<Buffer> {}
export interface BooleanSchemaTyped extends BooleanSchema, AnySchemaT<boolean> {}
export interface DateSchemaTyped<T> extends DateSchema {}
export interface FunctionSchemaTyped<T> extends FunctionSchema {}
export interface NumberSchemaTyped extends NumberSchema, AnySchemaT<number> {}
export interface ObjectSchemaTyped<IN, OUT> extends ObjectSchema, AnySchemaT<IN, OUT> {}
export interface StringSchemaTyped extends StringSchema, AnySchemaT<string> {}
export interface LazySchemaTyped<T> extends LazySchema {}
