import { anyToErrorObject, StringMap } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import got from 'got'
import { Debug, DebugLogLevel, inspectAny } from '..'
import {
  SlackAttachmentField,
  SlackMessage,
  SlackSharedServiceCfg,
} from './slack.shared.service.model'

const GAE = !!process.env.GAE_INSTANCE

const DEFAULTS = (): SlackMessage => ({
  username: 'bot',
  channel: '#log',
  icon_emoji: ':spider_web:',
  text: 'no text',
})

const log = Debug('nc:nodejs-lib:slack')

export class SlackSharedService<CTX = any> {
  constructor(private slackServiceCfg: SlackSharedServiceCfg) {}

  // Convenience method
  async send(text: string, ctx?: CTX): Promise<void> {
    await this.sendMsg(
      {
        text,
      },
      ctx,
    )
  }

  /**
   * Send error.
   */
  async error(_err: any, opts: Partial<SlackMessage> = {}, ctx?: CTX): Promise<void> {
    const err = anyToErrorObject(_err)
    const text = err.stack || err.message
    await this.sendMsg(
      {
        level: DebugLogLevel.error,
        ...opts,
        text,
      },
      ctx,
    )
  }

  async sendMsg(msg: SlackMessage, ctx?: CTX): Promise<void> {
    const { webhookUrl } = this.slackServiceCfg

    log[msg.level || DebugLogLevel.info](
      ...[msg.text, msg.kv, msg.attachments, msg.mentions].filter(Boolean),
    )

    if (!webhookUrl) return

    this.processKV(msg)

    const body: SlackMessage = {
      ...DEFAULTS(),
      ...this.slackServiceCfg.defaults,
      ...msg,
    }

    body.channel = (this.slackServiceCfg.channelByLevel || {})[msg.level!] || body.channel

    await this.decorateMsg(body, ctx)

    body.text = inspectAny(body.text, {
      colors: false,
    })

    if (msg.mentions?.length) {
      body.text += '\n' + msg.mentions.map(s => `<@${s}>`).join(' ')
    }

    await got
      .post(webhookUrl, {
        json: body,
      })
      .catch(err => {
        // ignore (unless throwOnError is set), cause slack is weirdly returning non-json text "ok" response
        if (msg.throwOnError) throw err
      })
  }

  /**
   * Mutates msg.
   * To be overridden.
   */
  protected async decorateMsg(msg: SlackMessage, ctx?: CTX): Promise<void> {
    const tokens = [dayjs().toPretty()]

    // AppEngine-specific decoration
    if (GAE && ctx && typeof ctx === 'object' && typeof (ctx as any).header === 'function') {
      tokens.push(
        (ctx as any).header('x-appengine-country')!,
        (ctx as any).header('x-appengine-city')!,
        // ctx.header('x-appengine-user-ip')!,
      )
    }

    msg.text = [tokens.filter(Boolean).join(': '), msg.text].join('\n')
  }

  kvToFields(kv: StringMap<any>): SlackAttachmentField[] {
    return Object.entries(kv).map(([k, v]) => ({
      title: k,
      value: String(v),
      short: String(v).length < 80,
    }))
  }

  /**
   * mutates
   */
  private processKV(msg: SlackMessage): void {
    if (!msg.kv) return

    msg.attachments = (msg.attachments || []).concat({
      fields: this.kvToFields(msg.kv),
    })

    delete msg.kv
  }
}
