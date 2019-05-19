import { Extension, State, ValidationOptions } from '@hapi/joi'
import * as JoiLib from '@hapi/joi'
import { dayjs } from '@naturalcycles/time-lib'

export interface DateStringExtension {
  dateString (min?: string, max?: string): this
}

export interface DateStringParams {
  min?: string
  max?: string
}

export function dateStringExtension (joi: typeof JoiLib): Extension {
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
            max = dayjs()
              .add(14, 'hour')
              .toISODate()
          }
          if (min === 'today') {
            min = dayjs()
              .subtract(14, 'hour')
              .toISODate()
          }
          // console.log('min/max', min, max)

          const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/)
          if (!m || m.length <= 1) {
            err = 'string.dateString'
          } else if (min && v < min) {
            err = 'string.dateStringMin'
          } else if (max && v > max) {
            err = 'string.dateStringMax'
          } else if (!dayjs(v).isValid()) {
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
