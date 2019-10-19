import { CustomHelpers, Extension } from '@hapi/joi'
import * as JoiLib from '@hapi/joi'
import { dayjs } from '@naturalcycles/time-lib'

export interface DateStringExtension {
  dateString(min?: string, max?: string): this
}

export interface DateStringParams {
  min?: string
  max?: string
}

export function dateStringExtension(joi: typeof JoiLib): Extension {
  return {
    type: 'dateString',
    base: joi.string(),
    messages: {
      dateString: 'needs to be a date string (yyyy-mm-dd)',
      dateStringMin: 'needs to be not earlier than {{min}}',
      dateStringMax: 'needs to be not later than {{max}}',
      dateStringCalendarAccuracy: 'needs to be a calendar accurate date',
    },
    validate(v: string, helpers: CustomHelpers) {
      let err: string | undefined
      let min = helpers.schema.$_getFlag('min')
      let max = helpers.schema.$_getFlag('max')

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
        return {
          value: v,
          errors: helpers.error(err),
        }
      }

      return v // validation passed
    },
    // rules: {
    //   min: {
    //     // args: [
    //     //   {
    //     //     name: 'min',
    //     //     ref: true,
    //     //     assert: (value) => typeof value === 'string',
    //     //     message: 'must be a dateString'
    //     //   }
    //     // ],
    //     method (min: string) {
    //       return this.$_setFlag('min', min)
    //     },
    //   },
    //   max: {
    //     // args: [
    //     //   {
    //     //     name: 'max',
    //     //     ref: true,
    //     //     assert: (value) => typeof value === 'string',
    //     //     message: 'must be a dateString'
    //     //   }
    //     // ],
    //     method (max: string) {
    //       return this.$_setFlag('max', max)
    //     },
    //   },
    // },
  }
}
