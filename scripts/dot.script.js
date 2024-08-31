/*

node scripts/dot.script.js
node scripts/dot.script.js --count 3

 */

const { parseArgs } = require('node:util')
const { pDelay } = require('@naturalcycles/js-lib')
const { count: countStr, error } = parseArgs({
  options: {
    count: {
      type: 'string',
      default: '3',
    },
    error: {
      type: 'boolean',
      default: false,
    },
  },
}).values

const count = Number(countStr)

console.log({
  count,
  error,
})
;(async () => {
  for (let i = 1; i <= count; i++) {
    await pDelay(1000)
    console.log(i)
  }
  if (error) {
    console.log('the error')
    return process.exit(1)
  }
  console.log('done')
})()