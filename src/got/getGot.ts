import { URL } from 'url'
import { _since } from '@naturalcycles/js-lib'
import got, {
  AfterResponseHook,
  BeforeErrorHook,
  BeforeRequestHook,
  BeforeRetryHook,
  Got,
} from 'got'
import { inspectAny } from '..'
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

  if (opt.debug) {
    opt.logStart = opt.logFinished = opt.logResponse = true
  }

  return got.extend({
    // Most-important is to set to anything non-empty (so, requests don't "hang" by default).
    // Should be long enough to handle for slow responses from scaled cloud APIs in times of spikes
    // Ideally should be LESS than default Request timeout in backend-lib (so, it has a chance to error
    // before server times out with 503).
    //
    // UPD 2021-11-27
    // There are 2 types/strategies for requests:
    // 1. Optimized to get result no matter what. E.g in Cron jobs, where otherwise there'll be a job failure
    // 2. Part of the Backend request, where we better retry quickly and fail on timeout before Backend aborts it with "503 Request timeout"
    //
    // Here it's hard to set the default timeout right for both use-cases.
    // So, if it's important, you should override it according to your use-cases:
    // - set it longer for Type 1 (e.g 120 seconds)
    // - set it shorter for Type 2 (e.g 10/20 seconds)
    // Please beware of default Retry strategy of Got:
    // by default it will retry 2 times (after first try)
    // First delay between tries will be ~1 second, then ~2 seconds
    // Each retry it'll wait up to `timeout` (so, up to 60 seconds by default).
    // So, for 3 tries it multiplies your timeout by 3 (+3 seconds between the tries).
    // So, e.g 60 seconds timeout with 2 retries becomes up to 183 seconds.
    // Which definitely doesn't fit into default "RequestTimeout"
    timeout: 60_000,
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
      beforeRetry: [
        gotBeforeRetryHook(opt),
        // User hooks go AFTER
        ...(opt.hooks?.beforeRetry || []),
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
    const statusCode = err.response?.statusCode || 0
    const { method, url, prefixUrl } = err.options
    const shortUrl = getShortUrl(opt, url, prefixUrl)
    const { started, retryCount } = (err.request?.options.context || {}) as GotRequestContext

    const body = err.response?.body
      ? inspectAny(err.response.body, {
          maxLen: maxResponseLength,
          colors: false,
        })
      : err.message

    // We don't include Response/Body/Message in the log, because it's included in the Error thrown from here
    opt.logger!.log(
      [
        ' <<',
        statusCode,
        method,
        shortUrl,
        retryCount && `(retry ${retryCount})`,
        'error',
        started && 'in ' + _since(started),
      ]
        .filter(Boolean)
        .join(' '),
    )

    // timings are not part of err.message to allow automatic error grouping in Sentry
    // Colors are not used, because there's high chance that this Error will be propagated all the way to the Frontend
    err.message = [[statusCode, method, shortUrl].filter(Boolean).join(' '), body]
      .filter(Boolean)
      .join('\n')

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
      const { retryCount } = options.context as GotRequestContext
      const shortUrl = getShortUrl(opt, options.url, options.prefixUrl)
      opt.logger!.log(
        [' >>', options.method, shortUrl, retryCount && `(retry ${retryCount})`].join(' '),
      )
    }
  }
}

// Here we log always, because it's similar to ErrorHook - we always log errors
// Because Retries are always result of some Error
function gotBeforeRetryHook(opt: GetGotOptions): BeforeRetryHook {
  const { maxResponseLength = 10_000 } = opt

  return (options, err, retryCount) => {
    // opt.logger!.log('beforeRetry', retryCount)
    const statusCode = err?.response?.statusCode || 0
    const { method, url, prefixUrl } = options
    const shortUrl = getShortUrl(opt, url, prefixUrl)
    const { started } = options.context as GotRequestContext
    Object.assign(options.context, { retryCount })

    const body = err?.response?.body
      ? inspectAny(err.response.body, {
          maxLen: maxResponseLength,
          colors: false,
        })
      : err?.message

    // We don't include Response/Body/Message in the log, because it's included in the Error thrown from here
    opt.logger!.warn(
      [
        [
          ' <<',
          statusCode,
          method,
          shortUrl,
          retryCount && retryCount > 1 ? `(retry ${retryCount - 1})` : '(first try)',
          'error',
          started && 'in ' + _since(started),
        ]
          .filter(Boolean)
          .join(' '),
        body,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }
}

// AfterResponseHook is never called on Error
// So, coloredHttpCode(resp.statusCode) is probably useless
function gotAfterResponseHook(opt: GetGotOptions = {}): AfterResponseHook {
  return resp => {
    const success = resp.statusCode >= 200 && resp.statusCode < 400

    if (opt.logFinished) {
      const { started, retryCount } = resp.request.options.context as GotRequestContext
      const { url, prefixUrl, method } = resp.request.options
      const shortUrl = getShortUrl(opt, url, prefixUrl)

      opt.logger!.log(
        [
          ' <<',
          resp.statusCode,
          method,
          shortUrl,
          retryCount && `(retry ${retryCount - 1})`,
          started && 'in ' + _since(started),
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
