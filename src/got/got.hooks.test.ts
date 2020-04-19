import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { _anyToErrorObject, _range } from '@naturalcycles/js-lib'
import * as nock from 'nock'
import { arraySchema, getValidationResult, integerSchema, objectSchema } from '..'
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

const items = _range(0, 100).map(id => ({ id }))
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

test('backend error', async () => {
  await expect(
    _got.get('http://a.com/backendErr', {
      searchParams: { q: 1 },
    }),
  ).rejects.toThrowErrorMatchingSnapshot()
})
