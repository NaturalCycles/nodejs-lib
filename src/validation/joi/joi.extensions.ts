import { NumberSchema, StringSchema } from '@hapi/joi'
import * as JoiLib from '@hapi/joi'
import { DateStringExtension, dateStringExtension } from './dateString.extension'
import { DividableExtension, dividableExtension } from './dividable.extension'
import { AnySchemaTyped } from './joi.model'

export const Joi: ExtendedJoi = JoiLib.defaults(schema => {
  // hack to prevent infinite recursion due to .empty('') where '' is a stringSchema itself
  if (schema.schemaType === 'string') {
    return (schema as StringSchema)
      .trim() // trim all strings by default
      .empty([schema.valid('')]) // treat '' as empty (undefined, will be stripped out)
  }

  // Treat `null` as undefined for all schema types
  // undefined values will be stripped by default from object values
  return schema.empty(null)
})
  .extend((joi: typeof JoiLib) => dateStringExtension(joi))
  .extend((joi: typeof JoiLib) => dividableExtension(joi))

export interface ExtendedJoi extends JoiLib.Root {
  string(): ExtendedStringSchema
  number(): ExtendedNumberSchema
}

export interface ExtendedStringSchema
  extends StringSchema,
    DateStringExtension,
    AnySchemaTyped<string> {}

export interface ExtendedNumberSchema
  extends NumberSchema,
    DividableExtension,
    AnySchemaTyped<number> {}
