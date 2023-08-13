import { hasColors, grey } from './colors'

test('colors', () => {
  console.log(grey('sdf'))
  console.log(grey(15, 16))
  // console.log(grey({hello: 'world', num: 5}))
})

test('hasColors', () => {
  console.log(hasColors)
})
