import { URL } from 'url'
import { _since } from '@naturalcycles/js-lib'
import got, { AfterResponseHook, BeforeErrorHook, BeforeRequestHook, Got, HTTPError } from 'got'
import { inspectAny } from '..'
import { dimGrey, grey, red, yellow } from '../colors'
import { GetGotOptions, GotRequestContext } from './got.model'

/**
 * Returns instance of Got with "reasonable defaults":
 *
 * 1. Error handler hook that prints helpful errors.
 * 2. Hooks that log start/end of request (optional, false by default).
 * 3. Reasonable defaults(tm), e.g non-infinite Timeout
 */
export function getGot(opt: GetGotOptions = {}): Got {
  opt.logger ||= console

  return got.extend({
    // Most-important is to set to anything non-empty (so, requests don't "hang" by default).
    // Should be long enough to handle for slow responses from scaled cloud APIs in times of spikes
    // Ideally should be LESS than default Request timeout in backend-lib (so, it has a chance to error
    // before server times out with 503).
    timeout: 90_000,
    ...opt,
    hooks: {
      ...opt.hooks,
      beforeError: [
        ...(opt.hooks?.beforeError || []),
        // User hooks go BEFORE
        gotErrorHook(opt),
      ],
      beforeRequest: [
        gotBeforeRequestHook(opt),
        // User hooks go AFTER
        ...(opt.hooks?.beforeRequest || []),
      ],
      afterResponse: [
        ...(opt.hooks?.afterResponse || []),
        // User hooks go BEFORE
        gotAfterResponseHook(opt),
      ],
    },
  })
}

/**
 * Without this hook (default behaviour):
 *
 * HTTPError: Response code 422 (Unprocessable Entity)
 *  at EventEmitter.<anonymous> (.../node_modules/got/dist/source/as-promise.js:118:31)
 *  at processTicksAndRejections (internal/process/task_queues.js:97:5) {
 *  name: 'HTTPError'
 *
 *
 * With this hook:
 *
 * HTTPError 422 GET http://a.com/err?q=1 in 8 ms
 * {
 *   message: 'Reference already exists',
 *   documentation_url: 'https://developer.github.com/v3/git/refs/#create-a-reference'
 * }
 *
 * Features:
 * 1. Includes original method and URL (including e.g searchParams) in the error message.
 * 2. Includes response.body in the error message (limited length).
 * 3. Auto-detects and parses JSON response body (limited length).
 * 4. Includes time spent (gotBeforeRequestHook must also be enabled).
 * UPD: excluded now to allow automatic Sentry error grouping
 */
function gotErrorHook(opt: GetGotOptions = {}): BeforeErrorHook {
  const { maxResponseLength = 10_000 } = opt

  return err => {
    if (err instanceof HTTPError) {
      const { statusCode } = err.response
      const { method, url, prefixUrl } = err.options
      const shortUrl = getShortUrl(opt, url, prefixUrl)
      // const { started } = context as GotRequestContext

      const body = inspectAny(err.response.body, {
        maxLen: maxResponseLength,
        colors: false,
      })

      // timings are not part of err.message to allow automatic error grouping in Sentry
      err.message = [[statusCode, method, shortUrl].filter(Boolean).join(' '), body]
        .filter(Boolean)
        .join('\n')
    }

    return err
  }
}

function gotBeforeRequestHook(opt: GetGotOptions): BeforeRequestHook {
  return options => {
    options.context = {
      ...options.context,
      started: Date.now(),
    } as GotRequestContext

    if (opt.logStart) {
      const shortUrl = getShortUrl(opt, options.url, options.prefixUrl)
      opt.logger!.log([dimGrey(' >>'), dimGrey(options.method), grey(shortUrl)].join(' '))
    }
  }
}

function gotAfterResponseHook(opt: GetGotOptions = {}): AfterResponseHook {
  return resp => {
    const success = resp.statusCode >= 200 && resp.statusCode < 400

    if (opt.logFinished) {
      const { started } = resp.request.options.context as GotRequestContext
      const { url, prefixUrl, method } = resp.request.options
      const shortUrl = getShortUrl(opt, url, prefixUrl)

      opt.logger!.log(
        [
          dimGrey(' <<'),
          coloredHttpCode(resp.statusCode),
          dimGrey(method),
          grey(shortUrl),
          started && dimGrey('in ' + _since(started)),
        ]
          .filter(Boolean)
          .join(' '),
      )
      // console.log(`afterResp! ${resp.request.options.method} ${resp.url}`, { context: resp.request.options.context })
    }

    // Error responses are not logged, cause they're included in Error message already
    if (opt.logResponse && success) {
      opt.logger!.log(inspectAny(resp.body, { maxLen: opt.maxResponseLength }))
    }

    return resp
  }
}

function coloredHttpCode(statusCode: number): string {
  if (statusCode < 400) return dimGrey(statusCode) // default
  if (statusCode < 500) return yellow(statusCode)
  return red(statusCode)
}

function getShortUrl(opt: GetGotOptions, url: URL, prefixUrl?: string): string {
  let shortUrl = url.toString()

  if (opt.logWithSearchParams === false) {
    shortUrl = shortUrl.split('?')[0]!
  }

  if (opt.logWithPrefixUrl === false && prefixUrl && shortUrl.startsWith(prefixUrl)) {
    shortUrl = shortUrl.slice(prefixUrl.length)
  }

  return shortUrl
}
