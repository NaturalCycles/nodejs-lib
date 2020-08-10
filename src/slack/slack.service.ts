import { StringMap } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import got from 'got'
import { Debug, DebugLogLevel, inspectAny, InspectAnyOptions } from '..'
import {
  SlackApiBody,
  SlackAttachmentField,
  SlackMessage,
  SlackSharedServiceCfg,
} from './slack.service.model'

const GAE = !!process.env.GAE_INSTANCE

const DEFAULTS = (): SlackMessage => ({
  username: 'bot',
  channel: '#log',
  icon_emoji: ':spider_web:',
  items: 'no text',
})

const inspectOpt: InspectAnyOptions = {
  colors: false,
}

const log = Debug('nc:nodejs-lib:slack')

/**
 * Has 2 main methods:
 *
 * 1. .send({ items: any, channel: ..., ... })
 * Low-level method with all possible options available.
 *
 * 2. .log(...items: any[])
 * Shortcut method to "just log a bunch of things", everything is "by default" there.
 */
export class SlackService<CTX = any> {
  constructor(cfg: Partial<SlackSharedServiceCfg<CTX>>) {
    this.cfg = {
      messagePrefixHook: slackDefaultMessagePrefixHook,
      ...cfg,
    }
  }

  public cfg!: SlackSharedServiceCfg<CTX>

  /**
   * Allows to "log" many things at once, similar to `console.log(one, two, three).
   */
  async log(...items: any[]): Promise<void> {
    await this.send({
      // If it's an Array of just 1 item - treat it as non-array
      items: items.length === 1 ? items[0] : items,
    })
  }

  async send(msg: SlackMessage<CTX>): Promise<void> {
    const { webhookUrl, messagePrefixHook } = this.cfg

    if (!msg.noLog) {
      log[msg.level || DebugLogLevel.info](
        ...[msg.items, msg.kv, msg.attachments, msg.mentions].filter(Boolean),
      )
    }

    if (!webhookUrl) return

    // Transform msg.kv into msg.attachments
    if (msg.kv) {
      msg.attachments = [...(msg.attachments || []), { fields: this.kvToFields(msg.kv) }]

      delete msg.kv // to not pass it all the way to Slack Api
    }

    let text: string

    // Array has a special treatment here
    if (Array.isArray(msg.items)) {
      text = msg.items.map(t => inspectAny(t, inspectOpt)).join('\n')
    } else {
      text = inspectAny(msg.items, inspectOpt)
    }

    // Wrap in markdown-text-block if it's anything but plain String
    if (typeof msg.items !== 'string') {
      text = '```' + text + '```'
    }

    if (msg.mentions?.length) {
      text += '\n' + msg.mentions.map(s => `<@${s}>`).join(' ')
    }

    const json: SlackApiBody = {
      ...DEFAULTS(),
      ...this.cfg.defaults,
      ...msg,
      // Text with Prefix
      text: [messagePrefixHook(msg).join(': '), text].filter(Boolean).join('\n'),
    }

    json.channel = (this.cfg.channelByLevel || {})[msg.level!] || json.channel

    await got
      .post(webhookUrl, {
        json,
        responseType: 'text',
      })
      .catch(err => {
        // ignore (unless throwOnError is set)
        if (msg.throwOnError) throw err
      })
  }

  kvToFields(kv: StringMap<any>): SlackAttachmentField[] {
    return Object.entries(kv).map(([k, v]) => ({
      title: k,
      value: String(v),
      short: String(v).length < 80,
    }))
  }
}

export function slackDefaultMessagePrefixHook(msg: SlackMessage): string[] {
  const tokens = [dayjs().toPretty()]
  const { ctx } = msg

  // AppEngine-specific decoration
  if (GAE && ctx && typeof ctx === 'object' && typeof (ctx as any).header === 'function') {
    tokens.push(
      (ctx as any).header('x-appengine-country')!,
      (ctx as any).header('x-appengine-city')!,
      // ctx.header('x-appengine-user-ip')!,
    )
  }

  return tokens.filter(Boolean)
}
