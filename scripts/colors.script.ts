/*

yarn tsx scripts/colors.script.ts

 */

import type { Color, Modifiers } from 'chalk'
import chalk from 'chalk'
import { runScript } from '../src/script/runScript'

const s = 'Hello World! 1 2 3 4 5ms'

const colors: (typeof Color)[] = [
  'white',
  'grey',
  'yellow',
  'green',
  'red',
  'blue',
  'magenta',
  'cyan',
]
const modifiers: (typeof Modifiers)[] = ['dim', null as any, 'bold', 'inverse']

runScript(async () => {
  colors.forEach(color => {
    modifiers.forEach(mod => {
      if (mod) {
        console.log(chalk[color][mod](`${s} ${mod} ${color}`))
      } else {
        console.log(chalk[color](`${s} ${color}`))
      }
    })
  })
})
