import type { ValuesOf } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import { dimGrey } from '../colors'

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
export function requireEnvKeys<T extends readonly string[]>(
  ...keys: T
): { [k in ValuesOf<T>]: string } {
  return keys.reduce((r, k) => {
    const v = process.env[k]
    if (!v) throw new Error(`${k} env variable is required, but missing`)
    r[k] = v
    return r
  }, {} as { [k in ValuesOf<T>]: string })
}

export function requireFileToExist(filePath: string): void {
  if (!fs.pathExistsSync(filePath)) {
    throw new Error(`Required file should exist: ${filePath}`)
  }
}

export interface Json2EnvOpts {
  jsonPath: string
  prefix?: string

  /**
   * @default true
   */
  saveEnvFile?: boolean

  /**
   * @default true
   */
  bashEnv?: boolean

  /**
   * @default true
   */
  fail?: boolean

  debug?: boolean
  silent?: boolean
}

const JSON2ENV_OPT_DEF: Partial<Json2EnvOpts> = {
  saveEnvFile: true,
  bashEnv: true,
  fail: true,
}

export function json2env(opt: Json2EnvOpts): void {
  const { jsonPath, prefix, saveEnvFile, bashEnv, fail, debug, silent } = {
    ...JSON2ENV_OPT_DEF,
    ...opt,
  }

  if (!fs.pathExistsSync(jsonPath)) {
    if (fail) {
      throw new Error(`Path doesn't exist: ${jsonPath}`)
    }

    if (!silent) {
      console.log(`json2env input file doesn't exist, skipping without error (${jsonPath})`)
    }

    if (bashEnv) {
      appendBashEnv('')
    }

    return
  }

  // read file
  const json = fs.readJsonSync(jsonPath)

  const exportStr = objectToShellExport(json, prefix)
  if (debug) {
    console.log(json, exportStr)
  }

  if (saveEnvFile) {
    const shPath = `${jsonPath}.sh`
    fs.writeFileSync(shPath, exportStr)

    if (!silent) {
      console.log(`json2env created ${dimGrey(shPath)}:`)
      console.log(exportStr)
    }
  }

  if (bashEnv) {
    appendBashEnv(exportStr)
  }
}

function appendBashEnv(exportStr: string): void {
  const { BASH_ENV } = process.env
  if (BASH_ENV) {
    fs.appendFileSync(BASH_ENV, exportStr + '\n')

    console.log(`BASH_ENV file appended (${dimGrey(BASH_ENV)})`)
  }
}

/**
 * Turns Object with keys/values into a *.sh script that exports all keys as values.
 *
 * @example
 * { a: 'b', b: 'c'}
 *
 * will turn into:
 *
 * export a="b"
 * export b="c"
 */
export function objectToShellExport(o: any, prefix = ''): string {
  return Object.keys(o)
    .map(k => {
      const v = o[k]
      if (v) {
        return `export ${prefix}${k}="${v}"`
      }
    })
    .filter(Boolean)
    .join('\n')
}
