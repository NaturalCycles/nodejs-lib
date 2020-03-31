/*

yarn tsn colors.script.ts

 */

import { chalk } from '../src/colors'
import { runScript } from '../src/script'

const s = 'Hello World! 1 2 3 4 5ms'

const colors = ['white', 'grey', 'yellow', 'green', 'red', 'blue', 'magenta', 'cyan']
const modifiers = ['dim', null, 'bold', 'inverse']

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
