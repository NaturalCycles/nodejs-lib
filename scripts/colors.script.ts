/*

yarn tsn colors.script.ts

 */

import { Color, Modifiers } from 'chalk'
import { chalk } from '../src/colors'
import { runScript } from '../src/script'

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
