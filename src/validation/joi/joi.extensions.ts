import { Extension, State, StringSchema, ValidationOptions } from 'joi'
import * as JoiLib from 'joi'
import { DateTime } from 'luxon'
import { LUXON_ISO_DATE_FORMAT } from '../../util/localDate.util'

export const Joi: ExtendedJoi = JoiLib.defaults(schema => {
  if (schema.schemaType === 'string') {
    // trim all strings by default!
    return (schema as StringSchema).trim()
  }

  return schema
})
  .extend((joi: typeof JoiLib) => dateStringExtension(joi))
  .extend((joi: typeof JoiLib) => dividableExtension(joi))

export interface ExtendedJoi extends JoiLib.Root {
  string (): ExtendedStringSchema
  number (): ExtendedNumberSchema
}

export interface ExtendedStringSchema extends JoiLib.StringSchema {
  dateString (min?: string, max?: string): this
}

export interface ExtendedNumberSchema extends JoiLib.NumberSchema {
  dividable (q: number): this
}

interface DateStringParams {
  min?: string
  max?: string
}

function dateStringExtension (joi: typeof JoiLib): Extension {
  return {
    base: joi.string(),
    name: 'string',
    language: {
      dateString: 'needs to be a date string (yyyy-mm-dd)',
      dateStringMin: 'needs to be not earlier than {{min}}',
      dateStringMax: 'needs to be not later than {{max}}',
      dateStringCalendarAccuracy: 'needs to be a calendar accurate date',
    },
    rules: [
      {
        name: 'dateString',
        params: {
          min: joi.string().optional(),
          max: joi.string().optional(),
        },
        validate (params: DateStringParams, v: any, state: State, options: ValidationOptions) {
          let err: string | undefined
          let min = params.min
          let max = params.max

          // Today allows +-14 hours gap to account for different timezones
          if (max === 'today') {
            max = DateTime.utc()
              .plus({ hours: 14 })
              .toFormat(LUXON_ISO_DATE_FORMAT)
          }
          if (min === 'today') {
            min = DateTime.utc()
              .minus({ hours: 14 })
              .toFormat(LUXON_ISO_DATE_FORMAT)
          }
          // console.log('min/max', min, max)

          const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
          if (!m || m.length <= 1) {
            err = 'string.dateString'
          } else if (min && v < min) {
            err = 'string.dateStringMin'
          } else if (max && v > max) {
            err = 'string.dateStringMax'
          } else if (!DateTime.fromFormat(v, LUXON_ISO_DATE_FORMAT).isValid) {
            err = 'string.dateStringCalendarAccuracy'
          }

          if (err) {
            // tslint:disable-next-line:no-invalid-this
            return this.createError(
              err,
              {
                v,
                min,
                max,
              },
              state,
              options,
            )
          }

          return v // validation passed
        },
      },
    ],
  }
}

interface DividableParams {
  q: number
}

function dividableExtension (joi: typeof JoiLib): Extension {
  return {
    base: joi.number(),
    name: 'number',
    language: {
      dividable: 'needs to be dividable by {{q}}',
    },
    rules: [
      {
        name: 'dividable',
        params: {
          q: joi
            .number()
            .integer()
            .positive(),
        },
        validate (params: DividableParams, v: any, state: State, options: ValidationOptions) {
          if (v % params.q !== 0) {
            // tslint:disable-next-line:no-invalid-this
            return this.createError(
              'number.dividable',
              {
                v,
                q: params.q,
              },
              state,
              options,
            )
          }

          return v
        },
      },
    ],
  }
}
