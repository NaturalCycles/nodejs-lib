import { sanitizeHTML } from './sanitize.util'

test('sanitize', () => {
  const s = 'hello <b>Dolly! <img src="evil" yes'

  const r = sanitizeHTML(s, {
    allowedTags: [],
    // disallowedTagsMode: 'escape',
  })
  expect(r).toMatchInlineSnapshot(`"hello Dolly! "`)
})
