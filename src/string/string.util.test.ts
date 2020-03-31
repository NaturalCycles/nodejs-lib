import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _range } from '@naturalcycles/js-lib'
import { inspectAny } from '../index'
import { jsonParseIfPossible } from './string.util'

test('inspectAny', () => {
  expectResults(
    v => inspectAny(v, { noErrorStack: true }),
    mockAllKindsOfThings(),
  ).toMatchSnapshot()
})

test('inspectAny maxLen', () => {
  const obj = _range(1, 1000).join(',')
  expect(inspectAny(obj, { maxLen: 10 })).toBe(`1,2,3,4,5,... 4 KB message truncated`)
})

test('jsonParseIfPossible', () => {
  expectResults(v => jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()
})
