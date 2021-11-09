import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { noopLogger } from '@naturalcycles/js-lib'
import nock = require('nock')
import { slackDefaultMessagePrefixHook, SlackService } from './slack.service'

let lastBody: any

beforeEach(() => {
  lastBody = null
})

beforeAll(() => {
  mockTime()
})

afterAll(() => {
  nock.cleanAll()
  nock.restore() // prevents jest memory leak
})

nock(/.*/)
  .persist()
  .post(/.*/)
  .reply((uri, body: any) => {
    lastBody = body
    return uri.includes('error') ? [500, 'some error!'] : [200, 'ok']
  })

const slackService = new SlackService({
  webhookUrl: 'https://dummyhook.com',
  logger: noopLogger,
  // defaults: {
  //   channel: 'test',
  // },
})

test('basic test', async () => {
  await slackService.log('hey')
  expect(lastBody).toMatchSnapshot()

  await slackService.send('hey')
  expect(lastBody).toMatchSnapshot()

  // Array of 1 item
  await slackService.send({ items: ['yo'] })
  expect(lastBody).toMatchSnapshot()

  // Just adding "everything" for coverage/snapshot
  const err = new Error('c error!')
  delete err.stack // to not include stack in the tested snapshot (flaky)

  await slackService.send(
    {
      items: ['a', { b: 'b' }, err],
      kv: { k1: 'v1' },
      mentions: ['kirill'],
    },
    { ctxKey: 'ctxValue' },
  )
  expect(lastBody).toMatchSnapshot()

  // await expect(slackService.send({items: 'hey', throwOnError: true})).rejects.toThrow('Network request forbidden')
})

test('no webhookUrl', async () => {
  const s = new SlackService({
    logger: noopLogger,
  })
  await s.log('anything')
  expect(lastBody).toBeNull() // should be unchanged
})

test('error', async () => {
  const s = new SlackService({
    webhookUrl: 'wrongUrl',
    logger: noopLogger,
  })

  // This should NOT throw, because errors are suppressed
  await s.log('yo')

  await expect(s.send({ items: 'yo', throwOnError: true })).rejects.toThrow('Invalid URL')
})

test('messagePrefixHook returning null should NOT be sent', async () => {
  const s = new SlackService({
    webhookUrl: 'https://valid.com',
    messagePrefixHook: () => null,
    logger: noopLogger,
  })
  await s.log('yo')
  expect(lastBody).toBeNull()

  // revert to default hook
  s.cfg.messagePrefixHook = slackDefaultMessagePrefixHook
  await s.log('yo')
  expect(lastBody).not.toBeNull()
})
