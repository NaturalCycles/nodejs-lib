import * as fs from 'fs-extra'
import { dimGrey } from '../colors'

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
   * @default true
   */
  fail?: boolean

  debug?: boolean
  silent?: boolean
}

const JSON2ENV_OPT_DEF: Partial<Json2EnvOptions> = {
  saveEnvFile: true,
  bashEnv: true,
  fail: true,
}

export function json2env(opt: Json2EnvOptions): void {
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
