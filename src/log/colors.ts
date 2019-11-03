import c from 'chalk'

// The point of re-exporting is:
// 1. Fix typings to allow to pass `number` (very common case)
// 2. Easier/shorter to import, rather than from 'chalk'
export type ColorFn = (...args: (string | number)[]) => string

export const white = c.white as ColorFn
export const boldWhite = c.bold.white as ColorFn
export const dimWhite = c.dim.white as ColorFn
export const grey = c.grey as ColorFn
export const yellow = c.yellow as ColorFn
export const dimYellow = c.dim.yellow as ColorFn
export const green = c.green as ColorFn
export const dimGreen = c.dim.green as ColorFn
