import * as fs from 'fs'
import type { ValuesOf } from '@naturalcycles/js-lib'
import 'dotenv/config' // ensure .env is read before requiring keys

/**
 * @example
 *
 * const {a, b} = requreEnvKeys(['a', 'b'])
 *
 * Will throw if any of the passed keys is not defined.
 */
export function requireEnvKeys<T extends readonly string[]>(
  ...keys: T
): { [k in ValuesOf<T>]: string } {
  // eslint-disable-next-line unicorn/no-array-reduce
  return keys.reduce((r, k) => {
    const v = process.env[k]
    if (!v) throw new Error(`${k} env variable is required, but missing`)
    r[k as ValuesOf<T>] = v
    return r
  }, {} as { [k in ValuesOf<T>]: string })
}

export function requireFileToExist(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file should exist: ${filePath}`)
  }
}
