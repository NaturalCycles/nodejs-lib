import { StringSchema } from 'joi'
import * as JoiLib from 'joi'
import { ExtendedNumberSchema, numberExtensions } from './number.extensions'
import { ExtendedStringSchema, stringExtensions } from './string.extensions'

export interface ExtendedJoi extends JoiLib.Root {
  // eslint-disable-next-line id-blacklist
  string(): ExtendedStringSchema
  // eslint-disable-next-line id-blacklist
  number(): ExtendedNumberSchema
}

/**
 * This is the only right place to import Joi from
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Joi: ExtendedJoi = JoiLib.defaults(schema => {
  // hack to prevent infinite recursion due to .empty('') where '' is a stringSchema itself
  if (schema.type === 'string') {
    return (
      (schema as StringSchema)
        .trim() // trim all strings by default
        // 2020-09-21: null values are NOT treated as EMPTY enymore
        // .empty([schema.valid('', null)]) // treat '' or null as empty (undefined, will be stripped out)
        // treat '' as empty (undefined, will be stripped out)
        .empty([schema.valid('')])
    )
  }

  // Treat `null` as undefined for all schema types
  // undefined values will be stripped by default from object values
  // 2020-09-21: breaking change: null values are NOT treated as EMPTY anymore
  // return schema.empty(null)
  return schema
})
  .extend((joi: typeof JoiLib) => stringExtensions(joi))
  .extend((joi: typeof JoiLib) => numberExtensions(joi))
