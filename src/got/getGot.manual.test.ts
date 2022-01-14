import { getGot } from './getGot'

const got = getGot({
  debug: true,
})

test('actual error', async () => {
  await got.post('http://a.com/err', {
    searchParams: { q: 1 },
    json: { a: 'a' },
  })
})
