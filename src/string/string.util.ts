import { AppError } from '@naturalcycles/js-lib'
import { inspect } from 'util'

export interface InspectIfPossibleOptions extends NodeJS.InspectOptions {
  /**
   * @default 1000
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
 * Attempts to parse object as JSON.
 * Safe (no error throwing).
 *
 * Enforces max length (default to 1000, pass 0 to skip it).
 *
 * Logs numbers as-is, e.g: `6`.
 * Logs strings as-is (without single quotes around, unlike default util.inspect behavior).
 * Otherwise - just uses util.inspect() with reasonable defaults.
 *
 * Returns 'empty_string' if empty string is passed.
 * Returns 'undefined' if undefined is passed (default util.inspect behavior).
 */
export function inspectAny(obj: any, opt: InspectIfPossibleOptions = {}): string {
  let s: string

  // Attempt to JSON.parse() it
  if (typeof obj === 'string') {
    obj = jsonParseIfPossible(obj)
  }

  if (obj instanceof Error) {
    // Stack includes message
    s = (!opt.noErrorStack && obj.stack) || [obj?.name, obj.message].filter(Boolean).join(': ')

    if (obj instanceof AppError) {
      s = [s, inspectAny(obj.data, opt)].join('\n')
    }
  } else if (typeof obj === 'string') {
    s = obj.trim() || 'empty_string'
  } else {
    s = inspect(obj, {
      breakLength: 80, // default: ??
      depth: 6, // default: 2
      ...opt,
    })
  }

  // Handle maxLen
  if (opt.maxLen && s.length > opt.maxLen) {
    s = s.substr(0, opt.maxLen) + `... ${Math.ceil(s.length / 1024)} KB message truncated`
  }

  return s
}

/**
 * Attempts to parse object as JSON.
 * Returns original object if JSON parse failed (silently).
 */
export function jsonParseIfPossible(obj: any): any {
  if (typeof obj === 'string' && obj) {
    try {
      return JSON.parse(obj)
    } catch {}
  }

  return obj
}
