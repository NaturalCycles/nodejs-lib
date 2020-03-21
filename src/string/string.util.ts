import { inspect } from 'util'

export interface InspectIfPossibleOptions extends NodeJS.InspectOptions {
  /**
   * @default 1000
   */
  maxLen?: number
}

/**
 * Attempts to parse object as JSON and inspect after.
 * Otherwise logs it as-is.
 * Safe (no error throwing).
 *
 * Enforces max length (default to 1000, pass 0 to skip it).
 *
 * Logs numbers as-is, e.g: `6`.
 * Logs strings wrapped in single quotes, e.g `'some string'`.
 * Which is how `util.inspect` normally works
 */
export function inspectIfPossible(obj: any, opt: InspectIfPossibleOptions = {}): string {
  let s: string

  try {
    s = inspect(JSON.parse(obj), opt)
  } catch {
    s = inspect(obj, opt)
  }

  if (opt.maxLen && s.length > opt.maxLen) {
    s = s.substr(0, opt.maxLen) + `... ${Math.ceil(s.length / 1024)} KB message truncated`
  }

  return s
}
