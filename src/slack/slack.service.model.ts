import { StringMap } from '@naturalcycles/js-lib'
import { DebugLogLevel, InspectAnyOptions } from '..'

/**
 * Properties that exists both in SlackApiBody (as per Slack API) and SlackMessage (our abstraction).
 */
export interface SlackMessageProps {
  /**
   * @default bot
   */
  username?: string

  channel?: string
  icon_url?: string

  /**
   * @default :spider_web:
   */
  icon_emoji?: string

  attachments?: SlackMessageAttachment[]
}

export interface SlackApiBody extends SlackMessageProps {
  text: string
}

export interface SlackMessage<CTX = any> extends SlackMessageProps {
  /**
   * The only *required* field.
   *
   * You can throw anything at it, it'll handle it appropriately:
   * String - as is
   * Object - pass via util.inspect()
   * Array - will pass each item via util.inspect() and join with \n
   * Error - print the stack nicely
   *
   * If you don't want the default Array behavior - you can pre-util.inspect() it yourself to your liking.
   */
  items: any

  /**
   * Optional "context object", to be used by `messagePrefixHook`.
   */
  ctx?: CTX

  level?: DebugLogLevel

  /**
   * Keys-values will be rendered as MessageAttachment with Fields
   */
  kv?: StringMap<any>

  /**
   * If specified - adds @name1, @name2 in the end of the message
   */
  mentions?: string[]

  /**
   * @default false
   * By default it ignores possible errors from slack
   */
  throwOnError?: boolean

  /**
   * @default false
   * Skips logging message
   */
  noLog?: boolean

  /**
   * Defaults to:
   * includeErrorData: true
   * includeErrorStack: true
   */
  inspectOptions?: InspectAnyOptions
}

export interface SlackAttachmentField {
  title: string
  value: string
  short?: boolean
}

// Taken from here: https://github.com/slackapi/node-slack-sdk/blob/master/packages/types/src/index.ts
export interface SlackMessageAttachment {
  // blocks?: (KnownBlock | Block)[];
  fallback?: string // either this or text must be defined
  color?: 'good' | 'warning' | 'danger' | string
  pretext?: string
  author_name?: string
  author_link?: string // author_name must be present
  author_icon?: string // author_name must be present
  title?: string
  title_link?: string // title must be present
  text?: string // either this or fallback must be defined
  fields?: SlackAttachmentField[]
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string // footer must be present
  ts?: number
  // actions?: AttachmentAction[];
  callback_id?: string
  mrkdwn_in?: ('pretext' | 'text' | 'fields')[]
}

/**
 * Return `null` to skip (filter out) the message completely.
 */
export type SlackMessagePrefixHook<CTX = any> = (
  msg: SlackMessage<CTX>,
) => string[] | null | Promise<string[] | null>

export interface SlackServiceCfg<CTX = any> {
  /**
   * Undefined means slack is disabled.
   */
  webhookUrl?: string

  defaults?: Partial<SlackMessage>

  /**
   * Override channel when msg.level is set.
   * key: DebugLogLevel
   * value: channel name to send message to
   */
  channelByLevel?: StringMap

  /**
   * Function to return an array of "prefix tokens" (will be joined by ': ').
   * Allows to skip (filter out) the message by returning `null`.
   */
  messagePrefixHook: SlackMessagePrefixHook<CTX>
}
