#!/usr/bin/env node

import * as yargs from 'yargs'
import { requireEnvKeys, runScript, SlackSharedService } from '..'

runScript(async () => {
  const { channel, msg, username, emoji } = yargs.options({
    channel: {
      type: 'string',
      demandOption: true,
    },
    msg: {
      type: 'string',
      demandOption: true,
    },
    username: {
      type: 'string',
      default: 'bot',
    },
    emoji: {
      type: 'string',
      default: ':spider_web:',
    },
  }).argv

  const { SLACK_WEBHOOK_URL } = requireEnvKeys('SLACK_WEBHOOK_URL')

  const slack = new SlackSharedService({
    webhookUrl: SLACK_WEBHOOK_URL,
  })

  await slack.sendMsg({
    text: msg,
    channel,
    username,
    icon_emoji: emoji,
    throwOnError: true,
  })
})
