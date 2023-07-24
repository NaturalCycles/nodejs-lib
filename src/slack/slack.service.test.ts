import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { _stringifyAny, commonLoggerNoop, Fetcher, pExpectedError } from '@naturalcycles/js-lib'
import { slackDefaultMessagePrefixHook, SlackService } from './slack.service'

let slackService = new SlackService({
  webhookUrl: 'https://dummyhook.com',
  logger: commonLoggerNoop,
  // defaults: {
  //   channel: 'test',
  // },
})

let lastBody: any

function mockSlack(): void {
  jest
    .spyOn((slackService as any as { fetcher: Fetcher }).fetcher, 'callNativeFetch')
    .mockImplementation(async (url, init) => {
      lastBody = init.body

      if (url.includes('error')) {
        return new Response('some error!', {
          status: 500,
        })
      }

      return new Response('ok')
    })
}

beforeEach(() => {
  lastBody = null
  mockTime()
  mockSlack()
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
  slackService = new SlackService({
    logger: commonLoggerNoop,
  })
  await slackService.log('anything')
  expect(lastBody).toBeNull() // should be unchanged
})

test('error', async () => {
  slackService = new SlackService({
    webhookUrl: 'wrongUrl',
    logger: commonLoggerNoop,
  })

  // This should NOT throw, because errors are suppressed
  await slackService.log('yo')

  const err = await pExpectedError(slackService.send({ items: 'yo', throwOnError: true }))
  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "HttpRequestError: POST wrongUrl
    Caused by: TypeError: Failed to parse URL from wrongUrl
    Caused by: TypeError: Invalid URL"
  `)
})

test('messagePrefixHook returning null should NOT be sent', async () => {
  slackService = new SlackService({
    webhookUrl: 'https://valid.com',
    messagePrefixHook: () => null,
    logger: commonLoggerNoop,
  })
  mockSlack()
  await slackService.log('yo')
  expect(lastBody).toBeNull()

  // revert to default hook
  slackService.cfg.messagePrefixHook = slackDefaultMessagePrefixHook
  await slackService.log('yo')
  expect(lastBody).not.toBeNull()
})
