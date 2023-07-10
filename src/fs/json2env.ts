import * as fs from 'node:fs'
import { AnyObject } from '@naturalcycles/js-lib'
import { dimGrey } from '../colors'
import { _pathExistsSync, _readJsonSync, _writeFileSync } from './fs.util'

export interface Json2EnvOptions {
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
   * Appends GITHUB_ENV file, also GITHUB_OUTPUT for that step
   *
   * @default true
   */
  githubEnv?: boolean

  /**
   * @default true
   */
  fail?: boolean

  debug?: boolean
  silent?: boolean
}

const JSON2ENV_OPT_DEF: Partial<Json2EnvOptions> = {
  saveEnvFile: true,
  bashEnv: true,
  githubEnv: true,
  fail: true,
}

export function json2env(opt: Json2EnvOptions): void {
  const { jsonPath, prefix, saveEnvFile, bashEnv, githubEnv, fail, debug, silent } = {
    ...JSON2ENV_OPT_DEF,
    ...opt,
  }

  if (!_pathExistsSync(jsonPath)) {
    if (fail) {
      throw new Error(`Path doesn't exist: ${jsonPath}`)
    }

    if (!silent) {
      console.log(`json2env input file doesn't exist, skipping without error (${jsonPath})`)
    }

    if (bashEnv) {
      appendToBashEnv({})
    }

    return
  }

  // read file
  const json: AnyObject = _readJsonSync(jsonPath)

  if (debug) {
    console.log(json)
  }

  if (saveEnvFile) {
    const shPath = `${jsonPath}.sh`
    const exportStr = objectToShellExport(json, prefix)
    _writeFileSync(shPath, exportStr)

    if (!silent) {
      console.log(`json2env created ${dimGrey(shPath)}:`)
      console.log(exportStr)
    }
  }

  if (bashEnv) {
    appendToBashEnv(json, prefix)
  }

  if (githubEnv) {
    appendToGithubEnv(json, prefix)
    appendToGithubOutput(json, prefix)
  }
}

export function appendToBashEnv(obj: AnyObject, prefix = ''): void {
  const { BASH_ENV } = process.env
  if (BASH_ENV) {
    fs.appendFileSync(BASH_ENV, objectToShellExport(obj, prefix))
    console.log(`BASH_ENV file appended (${dimGrey(BASH_ENV)})`)
  }
}

export function appendToGithubEnv(obj: AnyObject, prefix = ''): void {
  const { GITHUB_ENV } = process.env
  if (GITHUB_ENV) {
    fs.appendFileSync(GITHUB_ENV, objectToGithubActionsEnv(obj, prefix))
    console.log(`GITHUB_ENV file appended (${dimGrey(GITHUB_ENV)})`)
  }
}

export function appendToGithubOutput(obj: AnyObject, prefix = ''): void {
  const { GITHUB_OUTPUT } = process.env
  if (GITHUB_OUTPUT) {
    fs.appendFileSync(GITHUB_OUTPUT, objectToGithubActionsEnv(obj, prefix))
    console.log(`GITHUB_OUTPUT file appended (${dimGrey(GITHUB_OUTPUT)})`)
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
 *
 * Quotes are important, otherwise it'll break on e.g space character in the value.
 * Includes trailing newline for composability.
 */
export function objectToShellExport(obj: AnyObject, prefix = ''): string {
  if (!Object.keys(obj).length) return ''

  return (
    Object.entries(obj)
      .map(([k, v]) => {
        if (v) {
          return `export ${prefix}${k}="${v}"`
        }
      })
      .filter(Boolean)
      .join('\n') + '\n'
  ) // trailing \n is important
}

/**
 * Turns Object with keys/values into a file of key-value pairs
 *
 * @example
 * { a: 'b', b: 'c'}
 *
 * will turn into:
 *
 * a="b"
 * b="c"
 *
 * Quotes are important, otherwise it'll break on e.g space character in the value.
 * Includes trailing newline for composability.
 *
 * UPD: Quoted values behave inconsistently, so we're trying to NOT quote now, and-see-what-happens.
 */
export function objectToGithubActionsEnv(obj: AnyObject, prefix = ''): string {
  if (!Object.keys(obj).length) return ''

  return (
    Object.entries(obj)
      .map(([k, v]) => {
        if (v) {
          return `${prefix}${k}=${v}`
        }
      })
      .filter(Boolean)
      .join('\n') + '\n'
  ) // trailing \n is important
}
