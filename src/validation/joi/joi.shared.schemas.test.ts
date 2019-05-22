import { semVerSchema, urlSchema } from './joi.shared.schemas'
import { validate } from './joi.validation.util'

test('semVerSchema', async () => {
  // invalid
  ;[undefined, null, '', 3, '1.', '1.5.', '1.5.x', '1.5.e', '1', '1.5', '1.5.3.2'].forEach(v => {
    try {
      validate(v, semVerSchema)
      console.log('value', v)
      fail('expected to fail on invalid value (see console)')
    } catch {}
  })

  // valid
  ;['1.0.0', '1.5.3', '2.9.4', '3.0.14', '0.0.14'].forEach(v => {
    validate(v, semVerSchema)
  })
})

test('urlSchema', () => {
  const schema = urlSchema()
  const schemaAllowHttp = urlSchema(['https', 'http'])

  expect(() => validate('abc', schema)).toThrow()

  validate('https://example.com', schema)
  expect(() => validate('http://example.com', schema)).toThrow()

  validate('https://example.com', schemaAllowHttp)
  validate('http://example.com', schemaAllowHttp)
})
