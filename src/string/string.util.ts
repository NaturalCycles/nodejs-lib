import { AppError, _isErrorObject } from '@naturalcycles/js-lib'
import { inspect } from 'util'

export interface InspectAnyOptions extends NodeJS.InspectOptions {
  /**
   * @default 10_000
   */
  maxLen?: number

  /**
   * @default false
   * Set to true to not print Error.stack (keeping just Error.message).
   */
  noErrorStack?: boolean
}

/**
 * Transforms ANY to human-readable string (via util.inspect mainly).
 * Safe (no error throwing).
 *
 * Correclty prints Errors, AppErrors, ErrorObjects: error.message + \n + inspect(error.data)
 *
 * Enforces max length (default to 10_000, pass 0 to skip it).
 *
 * Logs numbers as-is, e.g: `6`.
 * Logs strings as-is (without single quotes around, unlike default util.inspect behavior).
 * Otherwise - just uses util.inspect() with reasonable defaults.
 *
 * Returns 'empty_string' if empty string is passed.
 * Returns 'undefined' if undefined is passed (default util.inspect behavior).
 */
export function inspectAny(obj: any, opt: InspectAnyOptions = {}): string {
  let s: string

  if (obj instanceof Error) {
    // Stack includes message
    s = (!opt.noErrorStack && obj.stack) || [obj?.name, obj.message].filter(Boolean).join(': ')

    if (obj instanceof AppError) {
      s = [s, Object.keys(obj.data).length > 0 && inspectAny(obj.data, opt)]
        .filter(Boolean)
        .join('\n')
    } else if (typeof (obj as any).code === 'string') {
      s = (obj as any).code + '\n' + s
    }
  } else if (_isErrorObject(obj)) {
    s = [obj.message, Object.keys(obj.data).length > 0 && inspectAny(obj.data, opt)]
      .filter(Boolean)
      .join('\n')
  } else if (typeof obj === 'string') {
    s = obj.trim() || 'empty_string'
  } else {
    s = inspect(obj, {
      breakLength: 80, // default: ??
      depth: 6, // default: 2
      ...opt,
    })
  }

  // todo: think about maybe removing it in favor of maxStringLength/maxArrayLength built-in options
  // Handle maxLen
  if (opt.maxLen && s.length > opt.maxLen) {
    s = s.substr(0, opt.maxLen) + `... ${Math.ceil(s.length / 1024)} KB message truncated`
  }

  return s
}
