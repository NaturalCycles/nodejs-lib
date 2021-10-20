const supporsColorLib = require('supports-color')

export function hasColors(): boolean {
  if (process.env['NO_COLOR']) return false // https://no-color.org/
  return !!supporsColorLib.stdout
}
