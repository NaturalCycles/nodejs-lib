import nock = require('nock')
import { pDelay, pTry } from '@naturalcycles/js-lib'
import { getGot } from './getGot'

afterAll(() => {
  nock.restore() // prevents jest memory leak
})

// On any GET request - reply with 'ok' after 1 second timeout
nock(/.*/)
  .persist()
  .get(/.*/)
  .reply(async (uri, _body: any, cb) => {
    await pDelay(1000)
    cb(null, [200, 'ok'])
  })

const got = getGot({
  debug: true,
  prefixUrl: 'https://a.com',
  timeout: 500,
  retry: {
    calculateDelay: ({ attemptCount }) => (attemptCount === 5 ? 0 : 10),
  },
  throwHttpErrors: false,
})

test('timeout error', async () => {
  const [err] = await pTry<Error, any>(got.get(''))
  console.error(err)
}, 60_000)
