import * as tty from 'tty'

/**
 * Based on: https://github.com/sindresorhus/yoctocolors/pull/5
 *
 * @experimental
 */
export const hasColors = !process.env['NO_COLOR'] && tty.WriteStream.prototype.hasColors()
