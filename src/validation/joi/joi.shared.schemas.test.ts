import { semVerSchema } from './joi.shared.schemas'
import { joiValidationService } from './joi.validation.service'

test('semVerSchema', async () => {
  // invalid
  ;[undefined, null, '', 3, '1.', '1.5.', '1.5.x', '1.5.e', '1', '1.5', '1.5.3.2'].forEach(v => {
    try {
      joiValidationService.validate(v, semVerSchema)
      console.log('value', v)
      fail('expected to fail on invalid value (see console)')
    } catch {}
  })

  // valid
  ;['1.0.0', '1.5.3', '2.9.4', '3.0.14', '0.0.14'].forEach(v => {
    joiValidationService.validate(v, semVerSchema)
  })
})
