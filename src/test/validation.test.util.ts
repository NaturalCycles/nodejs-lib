import { AnySchema } from '@hapi/joi'
import { validate } from '..'

export function testValidation(schema: AnySchema, valid: any[], invalid: any[]) {
  valid.forEach(v => {
    try {
      validate(v, schema)
    } catch (err) {
      console.log('value', v)
      throw err
    }
  })

  invalid.forEach(v => {
    try {
      validate(v, schema)
      console.log('value', v)
      fail(`expected to fail on invalid value: ${v}`)
    } catch {}
  })
}
