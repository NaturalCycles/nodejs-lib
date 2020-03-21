export interface GetGotOptions extends GotBeforeRequestHookOptions, GotAfterResponseHookOptions {}

export interface GotErrorHookOptions extends GotMaxResponseLength {}

export interface GotBeforeRequestHookOptions {
  /**
   * @default false
   */
  logStart?: boolean
}

export interface GotAfterResponseHookOptions extends GotMaxResponseLength {
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
}

export interface GotMaxResponseLength {
  /**
   * Max length of response object before it's truncated.
   *
   * @default 1000
   */
  maxResponseLength?: number
}

export interface GotRequestContext {
  /**
   * Millisecond-timestamp of when the request was started. To be able to count "time spent".
   */
  started: number
}
