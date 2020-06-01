import { getGot } from './getGot'

const got = getGot({
  logStart: true,
  logFinished: true,
  logResponse: true,
})

test('actual error', async () => {
  await got.get('http://a.com/err', {
    searchParams: { q: 1 },
  })
})
