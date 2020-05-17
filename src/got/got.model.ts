import type { Options } from 'got'

export interface GetGotOptions extends Options {
  /**
   * @default false
   */
  logStart?: boolean

  /**
   * Log when request is finished.
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
   * Max length of response object before it's truncated.
   *
   * @default 10_000
   */
  maxResponseLength?: number
}

export interface GotRequestContext {
  /**
   * Millisecond-timestamp of when the request was started. To be able to count "time spent".
   */
  started: number
}
