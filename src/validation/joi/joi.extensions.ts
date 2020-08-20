import { StringSchema } from 'joi'
import * as JoiLib from 'joi'
import { ExtendedNumberSchema, numberExtensions } from './number.extensions'
import { ExtendedStringSchema, stringExtensions } from './string.extensions'

export interface ExtendedJoi extends JoiLib.Root {
  string(): ExtendedStringSchema
  number(): ExtendedNumberSchema
}

/**
 * This is the only right place to import Joi from
 */
export const Joi: ExtendedJoi = JoiLib.defaults(schema => {
  // hack to prevent infinite recursion due to .empty('') where '' is a stringSchema itself
  if (schema.type === 'string') {
    return (schema as StringSchema)
      .trim() // trim all strings by default
      .empty([schema.valid('', null)]) // treat '' or null as empty (undefined, will be stripped out)
  }

  // Treat `null` as undefined for all schema types
  // undefined values will be stripped by default from object values
  return schema.empty(null)
})
  .extend((joi: typeof JoiLib) => stringExtensions(joi))
  .extend((joi: typeof JoiLib) => numberExtensions(joi))
