/*

yarn tsn ./scripts/colors.script.ts

 */

import { chalk, runScript } from '../src'

const s = 'Hello World! 1 2 3 4 5ms'

const colors = ['white', 'grey', 'yellow', 'green']

runScript(async () => {
  colors.forEach(color => {
    console.log(chalk[color].dim(`${s} dim ${color}`))
    console.log(chalk[color](`${s} ${color}`))
    console.log(chalk[color].bold(`${s} bold ${color}`))
  })
})
