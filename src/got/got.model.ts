import { AnyObject, CommonLogger } from '@naturalcycles/js-lib'
import type { Options } from 'got'

export interface GetGotOptions extends Options {
  /**
   * @default false
   */
  logStart?: boolean

  /**
   * Log when request is finished.
   *
   * @default false
   */
  logFinished?: boolean

  /**
   * Log actual response object.
   *
   * @default false
   */
  logResponse?: boolean

  /**
   * @default true
   * Set to false to exclude `prefixUrl` from logs (both success and error)
   */
  logWithPrefixUrl?: boolean

  /**
   * @default true
   * Set to false to strip searchParams from url when logging (both success and error)
   */
  logWithSearchParams?: boolean

  /**
   * Defaults to `console`
   */
  logger?: CommonLogger

  /**
   * Max length of response object before it's truncated.
   *
   * @default 10_000
   */
  maxResponseLength?: number
}

export interface GotRequestContext extends AnyObject {
  /**
   * Millisecond-timestamp of when the request was started. To be able to count "time spent".
   */
  started: number
}
