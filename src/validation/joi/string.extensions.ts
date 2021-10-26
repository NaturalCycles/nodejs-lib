import { dayjs } from '@naturalcycles/time-lib'
import { Extension, StringSchema } from 'joi'
import * as Joi from 'joi'
import * as sanitize from 'sanitize-html'
import { AnySchemaTyped } from './joi.model'

export interface ExtendedStringSchema extends StringSchema, AnySchemaTyped<string> {
  dateString(min?: string, max?: string): this
  stripHTML(opt?: JoiStripHTMLOptions): this
}

export interface JoiDateStringOptions {
  min?: string
  max?: string
}

export interface JoiStripHTMLOptions {
  /**
   * 'Strict' would throw an error if it detects any HTML.
   * Non-strict (default) does not error, but DOES convert the string to the string without HTML.
   * Internally uses `sanitize-html` library, with allowedTags = [], and method = 'discard'.
   */
  strict?: boolean
}

export function stringExtensions(joi: typeof Joi): Extension {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.dateString': '"{{#label}}" must be an ISO8601 date (yyyy-mm-dd)',
      'string.dateStringMin': '"{{#label}}" must be not earlier than {{#min}}',
      'string.dateStringMax': '"{{#label}}" must be not later than {{#max}}',
      'string.dateStringCalendarAccuracy': '"{{#label}}" must be a VALID calendar date',
      'string.stripHTML': '"{{#label}}" must NOT contain any HTML tags',
    },
    rules: {
      dateString: {
        method(min?: string, max?: string) {
          return this.$_addRule({
            name: 'dateString',
            args: { min, max } as JoiDateStringOptions,
          })
        },
        args: [
          {
            name: 'min',
            ref: true,
            assert: v => typeof v === 'string',
            message: 'must be a string',
          },
          {
            name: 'max',
            ref: true,
            assert: v => typeof v === 'string',
            message: 'must be a string',
          },
        ],
        validate(v: string, helpers, args: JoiDateStringOptions) {
          // console.log('dateString validate called', {v, args})

          let err: string | undefined
          let { min, max } = args

          // Today allows +-14 hours gap to account for different timezones
          if (max === 'today') {
            max = dayjs().add(14, 'hour').toISODate()
          }
          if (min === 'today') {
            min = dayjs().subtract(14, 'hour').toISODate()
          }
          // console.log('min/max', min, max)

          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
          if (!m || m.length <= 1) {
            err = 'string.dateString'
          } else if (min && v < min) {
            err = 'string.dateStringMin'
          } else if (max && v > max) {
            err = 'string.dateStringMax'
          } else if (!dayjs(v).isValid()) {
            // todo: replace with another regex (from ajv-validators) for speed
            err = 'string.dateStringCalendarAccuracy'
          }

          if (err) {
            return helpers.error(err, args)
          }

          return v // validation passed
        },
      },
      stripHTML: {
        method(opt?: JoiStripHTMLOptions) {
          return this.$_addRule({
            name: 'stripHTML',
            args: {
              strict: false,
              ...opt,
            },
          })
        },
        args: [
          {
            name: 'strict',
            ref: true,
            assert: v => typeof v === 'boolean',
            message: 'must be a boolean',
          },
        ],
        validate(v: string, helpers, args: JoiStripHTMLOptions) {
          // console.log('!!! stripHTML', args, v)

          const r = sanitize(v, {
            allowedTags: [], // no html tags allowed at all
            // disallowedTagsMode: 'discard' // discard is default
            parser: {
              decodeEntities: false, // prevent decoding/changing of &<>"'
            },
          })

          if (args.strict && r !== v) {
            return helpers.error('string.stripHTML', args)
          }

          return r // return converted value (or the same, if there was nothing to sanitize)
        },
      },
    },
  }
}
