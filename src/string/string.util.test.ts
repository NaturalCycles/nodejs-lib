import { _range } from '@naturalcycles/js-lib'
import { inspectIfPossible } from '../index'

const thingsToInspect: any[] = [
  undefined,
  null,
  '',
  ' ',
  'ho ho ho',
  15,
  function abc() {
    console.log('inside abc')
  },
  /i am regex, who are you?/,
  new Map([['a', 'b']]),
  [1, 2, 3],
  {
    a: 'a1',
    b: 'b1',
    c: {
      d: 25,
      e: undefined,
    },
  },
  {
    message: 'Reference already exists',
    documentation_url: 'https://developer.github.com/v3/git/refs/#create-a-reference',
  },
]

test('inspectIfPossible', () => {
  thingsToInspect.forEach(obj => {
    console.log(inspectIfPossible(obj))
  })

  const obj = _range(1, 1000).join(',')
  expect(inspectIfPossible(obj, { maxLen: 10 })).toBe(`'1,2,3,4,5... 4 KB message truncated`)
})
