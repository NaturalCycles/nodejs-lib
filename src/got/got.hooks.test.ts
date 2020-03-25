import { mockTime } from '@naturalcycles/dev-lib'
import * as nock from 'nock'
import { getGot } from './got.hooks'

beforeAll(() => {
  mockTime()
})

afterAll(() => {
  nock.cleanAll()
  nock.restore() // prevents jest memory leak
})

const okResp = { ok: 1 }
const errResp = {
  message: 'Reference already exists',
  documentation_url: 'https://developer.github.com/v3/git/refs/#create-a-reference',
}

nock(/.*/)
  .persist()
  .get(/.*/)
  .reply((uri, _body: any) => {
    // console.log({uri, _body})

    if (uri.includes('err')) {
      return [422, errResp]
    }

    return [200, okResp]
  })

const _got = getGot({
  logStart: true,
  logFinished: true,
  logResponse: true,
})

test('gotErrorHook', async () => {
  expect(await _got.get('http://a.com').json()).toEqual(okResp)

  await expect(
    _got.get('http://a.com/err', {
      searchParams: { q: 1 },
    }),
  ).rejects.toThrowErrorMatchingSnapshot()
})

test.skip('actual error', async () => {
  await _got.get('http://a.com/err', {
    searchParams: { q: 1 },
  })
})
