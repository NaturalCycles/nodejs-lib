import { DateTime } from 'luxon'
import { LUXON_ISO_DATE_FORMAT } from '../../util/localDate.util'
import { Joi } from './joi.extensions'
import { stringSchema } from './joi.shared.schemas'
import { joiValidationService } from './joi.validation.service'

test('dateString', async () => {
  const schema = {
    a1: stringSchema.dateString(),
  }

  shouldBeInvalid(schema, [
    undefined,
    null,
    '',
    'abc',
    5,
    () => 'a',
    { a1: 'a' },
    { a1: '01-01-2017' },
    { a1: '2017/05/05' },
    { a1: '2017-5-5' },
    { a1: '2017-05-5' },
    { a1: '-2017-05-05' },
  ])

  shouldBeValid(schema, [{ a1: '2017-06-21' }, { a1: '2017-01-01' }, { a1: '1970-01-01' }])
})

test('dateString min/max', async () => {
  const schema = {
    a1: stringSchema.dateString('2017-06-21', '2017-06-23'),
  }

  shouldBeInvalid(schema, [
    { a1: '1971-01-01' },
    { a1: '2017-06-19' },
    { a1: '2017-06-20' },
    { a1: '2017-06-24' },
    { a1: '2017-06-25' },
    { a1: '2018-01-01' },
  ])

  shouldBeValid(schema, [{ a1: '2017-06-21' }, { a1: '2017-06-22' }, { a1: '2017-06-23' }])
})

test('dateString min/max today', async () => {
  const schema = {
    a1: stringSchema.dateString('today', 'today'),
  }

  // Today allows +-14 hours gap to account for different timezones
  // testing -1day or +1day is not reliable (cause it can either fit or not fit withing +-14 hours window, so non-deterministic)
  const today = DateTime.utc()
  const todayMinus10hours = today.minus({ hours: 10 })
  const todayMinus2 = today.minus({ days: 2 })
  const todayPlus10hours = today.plus({ hours: 10 })
  const todayPlus2 = today.plus({ days: 2 })

  shouldBeInvalid(schema, [
    { a1: '1971-01-01' },
    { a1: '2450-06-19' },
    { a1: todayMinus2.toFormat(LUXON_ISO_DATE_FORMAT) },
    { a1: todayPlus2.toFormat(LUXON_ISO_DATE_FORMAT) },
  ])

  shouldBeValid(schema, [
    { a1: today.toFormat(LUXON_ISO_DATE_FORMAT) },
    { a1: todayMinus10hours.toFormat(LUXON_ISO_DATE_FORMAT) },
    { a1: todayPlus10hours.toFormat(LUXON_ISO_DATE_FORMAT) },
  ])
})

test('dividable', async () => {
  const schema = Joi.number().dividable(3)

  shouldBeInvalid(schema, [undefined, null, '', 'abc', 1, 2, 4, 5])

  shouldBeValid(schema, [3, 6, 9, 27])
})

function shouldBeInvalid (schema: any, values: any[]) {
  values.forEach(v => {
    try {
      joiValidationService.validate(v, schema)
      console.log('value', v)
      fail('expected to fail on invalid value (see console)')
    } catch {}
  })
}

function shouldBeValid (schema: any, values: any[]) {
  values.forEach(v => {
    try {
      joiValidationService.validate(v, schema)
    } catch (err) {
      console.log('value', v)
      throw err
    }
  })
}
