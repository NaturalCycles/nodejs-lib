import { StringMap, _truncate } from '@naturalcycles/js-lib'

export interface TableDiffOptions {
  /**
   * @default false
   */
  logEmpty?: boolean

  /**
   * @default undefined
   *
   * If set - values of each field will be stringified and limited to maxFieldLen.
   */
  maxFieldLen?: number
}

/**
 * Compares 2 objects, logs their differences via `console.table`.
 *
 * If `logEmpty` is set will explicitly log that fact, otherwise will log nothing.
 *
 * Function is located in nodejs-lib (not js-lib), because it's planned to improve in the future and add e.g colors (via chalk).
 */
export function tableDiff(a: object, b: object, opt: TableDiffOptions = {}): void {
  const { maxFieldLen } = opt
  const diff: StringMap<any> = {}

  if (a && b && a !== b) {
    new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => {
      if (a[k] !== b[k]) {
        diff[k] = {
          a: maxFieldLen && a[k] ? _truncate(String(a[k]), maxFieldLen) : a[k],
          b: maxFieldLen && b[k] ? _truncate(String(b[k]), maxFieldLen) : b[k],
        }
      }
    })
  }

  if (Object.keys(diff).length) {
    console.table(diff)
  } else if (opt.logEmpty) {
    console.log('no_difference')
  }
}
