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

export type SchemaTyped<T> =
  | AnySchemaT<T>
  | ArraySchemaTyped<T>
  | AlternativesSchemaTyped<T>
  | BinarySchemaTyped
  | BooleanSchemaTyped
  | DateSchemaTyped<T>
  | FunctionSchemaTyped<T>
  | NumberSchemaTyped
  | ObjectSchemaTyped<T>
  | StringSchemaTyped
  | LazySchemaTyped<T>

export interface AnySchemaT<T> extends AnySchema {}

export interface ArraySchemaTyped<T> extends ArraySchema, AnySchemaT<T[]> {}
export interface AlternativesSchemaTyped<T> extends AlternativesSchema {}
export interface BinarySchemaTyped extends BinarySchema, AnySchemaT<Buffer> {}
export interface BooleanSchemaTyped extends BooleanSchema, AnySchemaT<boolean> {}
export interface DateSchemaTyped<T> extends DateSchema {}
export interface FunctionSchemaTyped<T> extends FunctionSchema {}
export interface NumberSchemaTyped extends NumberSchema, AnySchemaT<number> {}
export interface ObjectSchemaTyped<T> extends ObjectSchema, AnySchemaT<T> {}
export interface StringSchemaTyped extends StringSchema, AnySchemaT<string> {}
export interface LazySchemaTyped<T> extends LazySchema {}
