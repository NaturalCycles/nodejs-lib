import {
  _omit,
  AnyObject,
  CommonLogger,
  commonLoggerMinLevel,
  CommonLogLevel,
  PQueue,
} from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import got from 'got'
import { inspectAny, InspectAnyOptions } from '..'
import {
  SlackApiBody,
  SlackAttachmentField,
  SlackMessage,
  SlackServiceCfg,
} from './slack.service.model'

const GAE = !!process.env['GAE_INSTANCE']

const DEFAULTS: SlackMessage = {
  username: 'bot',
  channel: '#log',
  icon_emoji: ':spider_web:',
  items: 'no text',
}

const INSPECT_OPT: InspectAnyOptions = {
  colors: false,
  includeErrorData: true,
  includeErrorStack: true,
}

/**
 * Has 2 main methods:
 *
 * 1. .send({ items: any, channel: ..., ... })
 * Low-level method with all possible options available.
 *
 * 2. .log(...items: any[])
 * Shortcut method to "just log a bunch of things", everything is "by default" there.
 *
 * .send method has a shortcut:
 * .send(string, ctx?: CTX)
 */
export class SlackService<CTX = any> {
  constructor(cfg: Partial<SlackServiceCfg<CTX>>) {
    this.cfg = {
      messagePrefixHook: slackDefaultMessagePrefixHook,
      logger: console,
      ...cfg,
      inspectOptions: {
        ...INSPECT_OPT,
        ...cfg.inspectOptions,
      },
    }
  }

  public cfg!: SlackServiceCfg<CTX>

  /**
   * Allows to "log" many things at once, similar to `console.log(one, two, three).
   */
  async log(...items: any[]): Promise<void> {
    await this.send({
      // If it's an Array of just 1 item - treat it as non-array
      items: items.length === 1 ? items[0] : items,
    })
  }

  async send(input: SlackMessage<CTX> | string, ctx?: CTX): Promise<void> {
    const { webhookUrl, messagePrefixHook, inspectOptions } = this.cfg

    // If String is passed as first argument - just transform it to a full SlackMessage
    const msg = typeof input === 'string' ? { items: input } : input

    if (ctx !== undefined) {
      Object.assign(msg, { ctx })
    }

    this.cfg.logger.log(...[msg.items, msg.kv, msg.attachments, msg.mentions].filter(Boolean))

    if (!webhookUrl) return

    // Transform msg.kv into msg.attachments
    if (msg.kv) {
      ;(msg.attachments ||= []).push({ fields: this.kvToFields(msg.kv) })

      delete msg.kv // to not pass it all the way to Slack Api
    }

    let text: string

    // Array has a special treatment here
    if (Array.isArray(msg.items)) {
      text = msg.items.map(t => inspectAny(t, inspectOptions)).join('\n')
    } else {
      text = inspectAny(msg.items, inspectOptions)
    }

    // Wrap in markdown-text-block if it's anything but plain String
    if (typeof msg.items !== 'string') {
      text = '```' + text + '```'
    }

    if (msg.mentions?.length) {
      text += '\n' + msg.mentions.map(s => `<@${s}>`).join(' ')
    }

    const prefix = await messagePrefixHook(msg)
    if (prefix === null) return // filtered out!

    const json: SlackApiBody = _omit(
      {
        ...DEFAULTS,
        ...this.cfg.defaults,
        ...msg,
        // Text with Prefix
        text: [prefix.join(': '), text].filter(Boolean).join('\n'),
      },
      ['items', 'ctx'],
    )

    await got
      .post(webhookUrl, {
        json,
        responseType: 'text',
        timeout: 90_000,
      })
      .catch(err => {
        // ignore (unless throwOnError is set)
        if (msg.throwOnError) throw err
      })
  }

  kvToFields(kv: AnyObject): SlackAttachmentField[] {
    return Object.entries(kv).map(([k, v]) => ({
      title: k,
      value: String(v),
      short: String(v).length < 80,
    }))
  }

  /**
   * Returns a CommonLogger implementation based on this SlackService instance.
   */
  getCommonLogger(opt: {
    minLogLevel: CommonLogLevel
    logChannel?: string
    warnChannel?: string
    errorChannel?: string
  }): CommonLogger {
    const { minLogLevel = 'log', logChannel, warnChannel, errorChannel } = opt
    const defaultChannel = this.cfg.defaults?.channel || DEFAULTS.channel!

    const q = new PQueue({
      concurrency: 1,
    })

    return commonLoggerMinLevel(
      {
        log: (...args) =>
          q.push(() => this.send({ items: args, channel: logChannel || defaultChannel })),
        warn: (...args) =>
          q.push(() => this.send({ items: args, channel: warnChannel || defaultChannel })),
        error: (...args) =>
          q.push(() => this.send({ items: args, channel: errorChannel || defaultChannel })),
      },
      minLogLevel,
    )
  }
}

export function slackDefaultMessagePrefixHook(msg: SlackMessage): string[] {
  const tokens = [dayjs().toPretty()]
  const { ctx } = msg

  // AppEngine-specific decoration
  if (GAE && ctx && typeof ctx === 'object' && typeof ctx.header === 'function') {
    tokens.push(ctx.header('x-appengine-country')!, ctx.header('x-appengine-city')!)
  }

  return tokens.filter(Boolean)
}
