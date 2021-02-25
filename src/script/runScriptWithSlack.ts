import { _substringAfterLast } from '@naturalcycles/js-lib'
import { inspectAny } from '..'
import { SlackService } from '..'
import { dimGrey, yellow } from '../colors'

export interface RunScriptOptions {
  /**
   * Set it to a channel name (e.g 'backend', without #), so it will report to slack on runScript failure.
   * Requires env.SLACK_WEBHOOK_URL to be set.
   * Overrides env.SLACK_ON_FAILURE
   */
  slackOnFailure?: string | false

  /**
   * Set it to a channel name (e.g 'backend') to report to slack on runScript success.
   * It will include the value returned to runScript.
   */
  slackOnSuccess?: string | false
}

const { SLACK_WEBHOOK_URL } = process.env

/**
 * Use it in your top-level scripts like this:
 *
 * runScript(async () => {
 *   await lalala()
 *   // my script goes on....
 * })
 *
 * Advantages:
 * - Works kind of like top-level await
 * - No need to add `void`
 * - No need to add `.then(() => process.exit()` (e.g to close DB connections)
 * - No need to add `.catch(err => { console.error(err); process.exit(1) })`
 * - Supports automatic failure reporting to Slack (!)
 */
export function runScriptWithSlack(fn: (...args: any[]) => any, opt: RunScriptOptions = {}): void {
  process.on('uncaughtException', err => {
    console.error('uncaughtException', err)
  })
  process.on('unhandledRejection', err => {
    console.error('unhandledRejection', err)
  })

  void (async () => {
    try {
      const res = await fn()

      if (opt.slackOnSuccess) {
        await onSuccess(res, opt)
      }

      setImmediate(() => process.exit(0))
    } catch (err) {
      console.error('runScript failed:', err)

      onFailure(err, opt)

      process.exitCode = 1
    }
  })()
}

async function onSuccess(res: any, opt: RunScriptOptions): Promise<void> {
  const { slackOnSuccess: channel } = opt

  if (!channel) return

  if (!SLACK_WEBHOOK_URL) {
    return console.warn(yellow(`env.SLACK_WEBHOOK_URL is missing, unable to slack on success`))
  }

  let text: string

  if (res) {
    text = inspectAny(res, {
      colors: false,
    })

    // Wrap in markdown-text-block if it's anything but plain String
    if (typeof res !== 'string') {
      text = '```' + text + '```'
    }
  } else {
    text = '```empty response```'
  }

  text = `\`${_substringAfterLast(__filename, '/')}\` completed successfully\n\n${text}`

  await new SlackService({
    webhookUrl: SLACK_WEBHOOK_URL,
  })
    .send({
      items: text,
      channel,
      noLog: true, // cause we logged the error already
      throwOnError: true,
    })
    .then(() => {
      console.log(dimGrey(`slacked the result to channel: ${channel}`))
    })
    .catch(_err => {
      console.log(yellow(`failed to slack the result to channel: ${channel}`))
      console.error(_err)
    })
}

function onFailure(err: Error, opt: RunScriptOptions): void {
  const channel = process.env['SLACK_ON_FAILURE'] || opt.slackOnFailure

  if (!channel) return

  if (!SLACK_WEBHOOK_URL) {
    return console.warn(yellow(`env.SLACK_WEBHOOK_URL is missing, unable to slack on failure`))
  }

  void new SlackService({
    webhookUrl: SLACK_WEBHOOK_URL,
  })
    .send({
      items: err,
      channel,
      noLog: true, // cause we logged the error already
      throwOnError: true,
    })
    .then(() => {
      console.log(dimGrey(`slacked the error to channel: ${channel}`))
    })
    .catch(_err => {
      console.log(yellow(`failed to slack the error to channel: ${channel}`))
      console.error(_err)
    })
}
