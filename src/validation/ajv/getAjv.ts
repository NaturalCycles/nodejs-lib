import Ajv from 'ajv'
import type { Options } from 'ajv'

const AJV_OPTIONS: Options = {
  removeAdditional: true,
  allErrors: true,
  // https://ajv.js.org/options.html#usedefaults
  useDefaults: 'empty', // this will mutate your input!
  // these are important and kept same as default:
  // https://ajv.js.org/options.html#coercetypes
  coerceTypes: false, // while `false` - it won't mutate your input
}

/**
 * Create Ajv with modified defaults.
 *
 * https://ajv.js.org/options.html
 */
export function getAjv(opt?: Options): Ajv {
  const ajv = new Ajv({
    ...AJV_OPTIONS,
    ...opt,
  })

  // Add custom formats
  addCustomAjvFormats(ajv)

  // Adds ajv "formats"
  // https://ajv.js.org/guide/formats.html
  require('ajv-formats')(ajv)

  // https://ajv.js.org/packages/ajv-keywords.html
  require('ajv-keywords')(ajv, [
    'transform', // trim, toLowerCase, etc.
    'uniqueItemProperties',
    'instanceof',
  ])

  // Adds $merge, $patch keywords
  // https://github.com/ajv-validator/ajv-merge-patch
  require('ajv-merge-patch')(ajv)

  return ajv
}

function addCustomAjvFormats(ajv: Ajv): Ajv {
  return (
    ajv
      .addFormat('id', /^[a-z0-9_]{6,64}$/)
      .addFormat('slug', /^[a-z0-9-]+$/)
      .addFormat('semVer', /^[0-9]+\.[0-9]+\.[0-9]+$/)
      // IETF language tag (https://en.wikipedia.org/wiki/IETF_language_tag)
      .addFormat('languageTag', /^[a-z]{2}(-[A-Z]{2})?$/)
      .addFormat('countryCode', /^[A-Z]{2}$/)
      .addFormat('currency', /^[A-Z]{3}$/)
      .addFormat('unixTimestamp', {
        type: 'number',
        validate: (n: number) => {
          // 16725225600 is 2500-01-01 in seconds
          return n >= 0 && n < 16725225600
        },
      })
      .addFormat('unixTimestampMillis', {
        type: 'number',
        validate: (n: number) => {
          // 16725225600000 is 2500-01-01 in milliseconds
          return n >= 0 && n < 16725225600000
        },
      })
      .addFormat('utcOffset', {
        type: 'number',
        validate: (n: number) => {
          // min: -14 hours
          // max +14 hours
          // multipleOf 15 (minutes)
          return n >= -14 * 60 && n <= 14 * 60 && Number.isInteger(n)
        },
      })
      .addFormat('utcOffsetHours', {
        type: 'number',
        validate: (n: number) => {
          // min: -14 hours
          // max +14 hours
          // multipleOf 15 (minutes)
          return n >= -14 && n <= 14 && Number.isInteger(n)
        },
      })
  )
}
