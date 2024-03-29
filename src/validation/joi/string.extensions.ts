import { LocalDate, localTimeNow } from '@naturalcycles/js-lib'
import Joi, { Extension, StringSchema as JoiStringSchema } from 'joi'

export interface StringSchema<TSchema = string> extends JoiStringSchema<TSchema> {
  dateString: (min?: string, max?: string) => this
}

export interface JoiDateStringOptions {
  min?: string
  max?: string
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
            args: { min, max } satisfies JoiDateStringOptions,
          })
        },
        args: [
          {
            name: 'min',
            // ref: true, // check false
            assert: v => v === undefined || typeof v === 'string',
            message: 'must be a string',
          },
          {
            name: 'max',
            // ref: true,
            assert: v => v === undefined || typeof v === 'string',
            message: 'must be a string',
          },
        ],
        validate(v: string, helpers, args: JoiDateStringOptions) {
          // console.log('dateString validate called', {v, args})

          let err: string | undefined
          let { min, max } = args

          // Today allows +-14 hours gap to account for different timezones
          if (max === 'today') {
            max = localTimeNow().add(14, 'hour').toISODate()
          }
          if (min === 'today') {
            min = localTimeNow().subtract(14, 'hour').toISODate()
          }
          // console.log('min/max', min, max)

          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
          if (!m || m.length <= 1) {
            err = 'string.dateString'
          } else if (min && v < min) {
            err = 'string.dateStringMin'
          } else if (max && v > max) {
            err = 'string.dateStringMax'
          } else if (!LocalDate.isValid(v)) {
            // todo: replace with another regex (from ajv-validators) for speed
            err = 'string.dateStringCalendarAccuracy'
          }

          if (err) {
            return helpers.error(err, args)
          }

          return v // validation passed
        },
      },
    },
  }
}
