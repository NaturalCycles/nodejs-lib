import { tableDiff } from './tableDiff'

test('tableDiff', () => {
  tableDiff({}, {}, { logEmpty: true })
  tableDiff({}, {})

  tableDiff(
    {
      a: 'a1',
    },
    {
      a: 'b1',
    },
  )

  tableDiff(
    {
      a: 'a1',
      c: 'c1',
    },
    {
      b: 'b1',
      c: 'c1',
    },
  )
})
