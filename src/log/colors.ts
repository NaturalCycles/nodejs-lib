import { Chalk } from 'chalk'
import * as c from 'chalk'

export const chalk = c as Chalk

// The point of re-exporting is:
// 1. Fix typings to allow to pass `number` (very common case)
// 2. Easier/shorter to import, rather than from 'chalk'
// export type ColorFn = (...args: (string | number)[]) => string

export const white = c.white
export const boldWhite = c.bold.white
export const dimWhite = c.dim.white
export const grey = c.grey
export const yellow = c.yellow
export const dimYellow = c.dim.yellow
export const green = c.green
export const dimGreen = c.dim.green
