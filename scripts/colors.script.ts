/*

yarn tsn ./scripts/colors.script.ts

 */

import {
  boldGreen,
  boldGrey,
  boldWhite,
  boldYellow,
  dimGreen,
  dimGrey,
  dimWhite,
  dimYellow,
  green,
  grey,
  runScript,
  white,
  yellow,
} from '../src'

const s = 'Hello World! 1 2 3 4 5ms'

runScript(async () => {
  console.log(dimWhite(s))
  console.log(white(s))
  console.log(boldWhite(s))
  console.log(dimGrey(s))
  console.log(grey(s))
  console.log(boldGrey(s))
  console.log(dimYellow(s))
  console.log(yellow(s))
  console.log(boldYellow(s))
  console.log(dimGreen(s))
  console.log(green(s))
  console.log(boldGreen(s))
})
