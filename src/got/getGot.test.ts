import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { _anyToErrorObject, _range, pTry } from '@naturalcycles/js-lib'
import nock = require('nock')
import { arraySchema, getValidationResult, HTTPError, integerSchema, objectSchema } from '..'
import { getGot } from './getGot'

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

const items = _range(100).map(id => ({ id }))
const itemsSchema = arraySchema(objectSchema({ id: integerSchema.max(98) }))
const { error: validationError } = getValidationResult(items, itemsSchema)
validationError!.data = { ...validationError!.data, httpStatusCode: 400 }
const joiErrorBackendResp = { error: _anyToErrorObject(validationError) }

nock(/.*/)
  .persist()
  .get(/.*/)
  .reply((uri, _body: any) => {
    // console.log({uri, _body})

    if (uri.includes('backendErr')) {
      return [400, joiErrorBackendResp]
    }

    if (uri.includes('err')) {
      return [422, errResp]
    }

    return [200, okResp]
  })

const got = getGot({
  logStart: true,
  logFinished: true,
  logResponse: true,
})

test('gotErrorHook', async () => {
  expect(await got.get('http://a.com').json()).toEqual(okResp)

  await expect(
    got.get('http://a.com/err', {
      searchParams: { q: 1 },
    }),
  ).rejects.toThrowErrorMatchingSnapshot()
})

test('backend error', async () => {
  const [err] = await pTry(
    got.get('http://a.com/backendErr', {
      searchParams: { q: 1 },
    }),
  )

  expect(err).toBeInstanceOf(HTTPError)
  expect(err).toMatchSnapshot()
})

test('logWithSearchParams=false', async () => {
  const g = getGot({
    logStart: true,
    logFinished: true,
    logResponse: true,
    logWithSearchParams: false,
  })

  await expect(
    g.get('http://a.com/err', {
      searchParams: { q: 1 },
    }),
  ).rejects.toThrowErrorMatchingSnapshot()
})

test('logWithPrefixUrl=false', async () => {
  const g = getGot({
    logStart: true,
    logFinished: true,
    logResponse: true,
    prefixUrl: 'http://a.com',
    logWithPrefixUrl: false,
  })

  await expect(
    g.get('err', {
      searchParams: { q: 1 },
    }),
  ).rejects.toThrowErrorMatchingSnapshot()
})
