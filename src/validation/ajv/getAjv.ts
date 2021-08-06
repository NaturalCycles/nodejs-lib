import Ajv from 'ajv'
import type { Options } from 'ajv'

/**
 * Create Ajv with modified defaults.
 */
export function getAjv(opt: Options = {}): Ajv {
  return new Ajv({
    // default Ajv configuration!
    removeAdditional: true,
    allErrors: true,
    ...opt,
  })
}
