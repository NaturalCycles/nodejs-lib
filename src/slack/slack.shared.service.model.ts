import { StringMap } from '@naturalcycles/js-lib'
import { DebugLogLevel } from '..'

export interface SlackMessage {
  /**
   * The only *required* field.
   * Should be called `item` instead, cause it can have different types, not just text (see further).
   *
   * You can throw anything at it, it'll handle it appropriately:
   * String - as is
   * Object - pass via util.inspect()
   * Array - will pass each item via util.inspect() and join with \n
   * Error - print the stack nicely
   *
   * If you don't want the default Array behavior - you can pre-util.inspect() it yourself to your liking.
   */
  text: any

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

  level?: DebugLogLevel
  attachments?: SlackMessageAttachment[]

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

export interface SlackSharedServiceCfg {
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
}

export interface SlackFileUploadOptions {
  throwOnError: boolean
}
/**
 * https://api.slack.com/methods/files.upload
 */
export interface SlackFileUploadMessage {
  /**
   * Comma-separated list of channel names or IDs where the file will be shared.
   */
  channels: string
  /**
   * The message text introducing the file in specified channels.
   */
  initial_comment: string
  /**
   * File contents via a POST variable. If omitting this parameter, you must provide a file.
   */
  content: Buffer
  /**
   * Filename of file.
   */
  filename?: string
}
