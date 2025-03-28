import { mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _range } from '@naturalcycles/js-lib'
import { Assertion, expect, test } from 'vitest'
import { _inspect } from '../index'

test('_inspect', () => {
  expectResults(v => _inspect(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('_inspect maxLen', () => {
  const obj = _range(1, 1000).join(',')
  expect(_inspect(obj, { maxLen: 10 })).toBe(`1,2,3,4,5,... 4 KB message truncated`)
})

function expectResults(fn: (...args: any[]) => any, values: any[]): Assertion {
  return expect(new Map(values.map(v => [v, fn(v)])))
}
