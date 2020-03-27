#!/usr/bin/env node

import * as yargs from 'yargs'
import { runScript, SlackSharedService } from '..'

runScript(async () => {
  const { channel, msg, username, emoji, webhook: webhookUrl } = yargs.options({
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
    webhook: {
      type: 'string',
      default: process.env.SLACK_WEBHOOK_URL,
    },
  }).argv

  if (!webhookUrl) {
    console.log(`Slack webhook is required, either via env.SLACK_WEBHOOK_URL or --webhook`)
    process.exit(1)
  }

  const slack = new SlackSharedService({
    webhookUrl,
  })

  await slack.sendMsg({
    text: msg,
    channel,
    username,
    icon_emoji: emoji,
    throwOnError: true,
  })
})
