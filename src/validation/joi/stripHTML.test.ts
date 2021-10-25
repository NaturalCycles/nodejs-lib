import { stringSchema, validate } from '../../index'

test.each([
  undefined,
  // '', will be coerced to undefined by another Joi rule, so, skipping
  'a',
  'la la la!',
  'yo % xo %% xo !@#$%^',
  'la\nla\nla',
  'a + b == c',
])('happy case: nothing to strip: %s', v => {
  const schema = stringSchema.stripHTML({ strict: true }).optional()

  const r = validate(v, schema)

  // Expect no conversion to be made
  expect(r).toBe(v)
  expect(r === v).toBe(true)
})

test.each([
  // no change here:
  [undefined, undefined],
  ['a', 'a'],
  ['la la la!', 'la la la!'],
  ['yo % xo %% xo !@#$%^', 'yo % xo %% xo !@#$%^'],
  ['la\nla\nla', 'la\nla\nla'],
  // to escape:
  ['a < b', 'a &lt; b'],
  ['<yo', ''],
  ['hello <b>dolly</b><img src="evil"  yes', 'hello dolly'],
])('non-strict mode should discard html (convert): %s => %s', (v, expected) => {
  const schema = stringSchema.stripHTML().optional()

  const r = validate(v, schema)
  expect(r).toBe(expected)
})

// Non-strict mode will never throw, actually. So, nothing to test there.
