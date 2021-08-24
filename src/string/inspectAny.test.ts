import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _range } from '@naturalcycles/js-lib'
import { inspectAny } from '../index'

test('inspectAny', () => {
  expectResults(v => inspectAny(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('inspectAny includeErrorData', () => {
  expectResults(
    v => inspectAny(v, { includeErrorData: true }),
    mockAllKindsOfThings(),
  ).toMatchSnapshot()
})

test('inspectAny maxLen', () => {
  const obj = _range(1, 1000).join(',')
  expect(inspectAny(obj, { maxLen: 10 })).toBe(`1,2,3,4,5,... 4 KB message truncated`)
})
