import { requireEnvKeys } from '../..'
import { SlackSharedService } from '../../slack/slack.shared.service'
require('dotenv').config()

const { SLACK_WEBHOOK_URL } = requireEnvKeys('SLACK_WEBHOOK_URL')

const slackService = new SlackSharedService({
  webhookUrl: SLACK_WEBHOOK_URL,
  defaults: {
    channel: 'test',
  },
})

test('hello world', async () => {
  await slackService.send(`Hello Slack`)
})

test('hello error', async () => {
  await slackService.error(new Error('hello error'))
  await slackService.error('hello error string')
})

test('attachments', async () => {
  await slackService.sendMsg({
    text: 'hello',
    attachments: [
      {
        pretext: 'Optional text that appears above the attachment block',
        color: '#2eb886', // green
        text: 'att text',
        // "title": "Slack API Documentation",
        // "title_link": "https://api.slack.com/",
        fields: [
          {
            title: 'Priority',
            value: 'High',
            short: true,
          },
          {
            title: 'Priority2',
            value: '<http://example.com|Low>',
            short: true,
          },
          {
            title: 'Priority3',
            value: 'Med',
            short: true,
          },
          {
            title: 'Priority4 short',
            value: 'Med',
            short: true,
          },
        ],
        // "footer": "Slack API",
        // "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        // "ts": 123456789,
      },
    ],
  })
})

test('kv', async () => {
  await slackService.sendMsg({
    text: 'hello kv',
    mentions: ['kirill'],
    kv: {
      a: 'a1',
      b: 'b1',
      long: 'very very very very very very very very very very very very very very long',
    },
  })
})

test('array', async () => {
  await slackService.log('a', 'b', { c: 'c' }, null)
})
