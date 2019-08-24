import { ValuesOf } from '@naturalcycles/js-lib'
import 'dotenv/config' // ensure .env is read before requiring keys

/*
type ObjectWithKeysOf<T extends readonly string[]> = {
  [k in ValuesOf<T>]: string
}
 */

/**
 * @example
 *
 * const {a, b} = requreEnvKeys(['a', 'b'])
 *
 * Will throw if any of the passed keys is not defined.
 */
export function requireEnvKeys<T extends readonly string[]> (
  ...keys: T
): { [k in ValuesOf<T>]: string } {
  return keys.reduce(
    (r, k) => {
      const v = process.env[k]
      if (!v) throw new Error(`${k} env variable is required, but missing`)
      r[k] = v
      return r
    },
    {} as { [k in ValuesOf<T>]: string },
  )
}
