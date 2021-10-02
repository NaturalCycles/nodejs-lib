import * as Joi from 'joi'
import { Extension, NumberSchema } from 'joi'
import { AnySchemaTyped } from './joi.model'

export interface ExtendedNumberSchema extends NumberSchema, AnySchemaTyped<number> {
  dividable(q: number): this
}

export function numberExtensions(joi: typeof Joi): Extension {
  return {
    base: joi.number(),
    type: 'number',
    messages: {
      'number.dividable': `"{{#label}}" must be dividable by {{#q}}`,
    },
    // validate (v, helpers) {
    //   console.log('number validate called', {v})
    // },
    rules: {
      // Based on: https://github.com/hapijs/joi/blob/master/API.md#extensions
      dividable: {
        multi: true,
        method(q: number) {
          return this.$_addRule({
            name: 'dividable',
            args: { q },
          })
        },
        args: [
          {
            name: 'q',
            ref: true,
            assert: v => typeof v === 'number' && !Number.isNaN(v),
            message: 'must be a number',
          },
        ],
        validate(v: number, helpers, args) {
          if (v % args['q'] === 0) {
            return v
          }

          return helpers.error('number.dividable', args)
        },
      },
    },
  }
}
