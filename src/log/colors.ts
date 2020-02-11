import * as chalk from 'chalk'

export { chalk }

// The point of re-exporting is:
// 1. Fix typings to allow to pass `number` (very common case)
// 2. Easier/shorter to import, rather than from 'chalk'
// export type ColorFn = (...args: (string | number)[]) => string

export const white = chalk.white
export const dimWhite = chalk.dim.white
export const boldWhite = chalk.bold.white
export const grey = chalk.grey
export const dimGrey = chalk.dim.grey
export const boldGrey = chalk.bold.grey
export const yellow = chalk.yellow
export const dimYellow = chalk.dim.yellow
export const boldYellow = chalk.bold.yellow
export const green = chalk.green
export const dimGreen = chalk.dim.green
export const boldGreen = chalk.bold.green
