import { _isHttpErrorResponse, _jsonParseIfPossible, _since } from '@naturalcycles/js-lib'
import got, { AfterResponseHook, BeforeErrorHook, BeforeRequestHook, Got, HTTPError } from 'got'
import { inspectAny } from '..'
import { dimGrey, grey, red, yellow } from '../colors'
import {
  GetGotOptions,
  GotAfterResponseHookOptions,
  GotBeforeRequestHookOptions,
  GotErrorHookOptions,
  GotRequestContext,
} from './got.model'

/**
 * Returns instance of Got with "reasonable defaults":
 *
 * 1. Error handler hook that prints helpful errors.
 * 2. Hooks that log start/end of request (optional, false by default).
 */
export function getGot(opt: GetGotOptions = {}): Got {
  return got.extend({
    hooks: {
      beforeError: [gotErrorHook(opt)],
      beforeRequest: [gotBeforeRequestHook(opt)],
      afterResponse: [gotAfterResponseHook(opt)],
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
 */
export function gotErrorHook(opt: GotErrorHookOptions = {}): BeforeErrorHook {
  const { maxResponseLength = 10000 } = opt

  return err => {
    if (err instanceof HTTPError) {
      const { statusCode } = err.response
      const { method, url, context } = err.options
      const { started } = context as GotRequestContext

      // Auto-detect and prettify JSON response (if any)
      let body = _jsonParseIfPossible(err.response.body)

      // Detect HttpErrorResponse
      if (_isHttpErrorResponse(body)) {
        body = body.error
      }

      body = inspectAny(body, {
        maxLen: maxResponseLength,
        colors: false,
      })

      err.message = [
        [statusCode, method, url, started && `in ${_since(started)}`].filter(Boolean).join(' '),
        body,
      ]
        .filter(Boolean)
        .join('\n')
    }

    return err
  }
}

export function gotBeforeRequestHook(opt: GotBeforeRequestHookOptions = {}): BeforeRequestHook {
  return options => {
    options.context = {
      ...options.context,
      started: Date.now(),
    } as GotRequestContext

    if (opt.logStart) {
      console.log([dimGrey(' >>'), dimGrey(options.method), grey(options.url)].join(' '))
    }
  }
}

export function gotAfterResponseHook(opt: GotAfterResponseHookOptions = {}): AfterResponseHook {
  return resp => {
    const success = resp.statusCode >= 200 && resp.statusCode < 400

    if (opt.logFinished) {
      const { started } = resp.request.options.context as GotRequestContext

      console.log(
        [
          dimGrey(' <<'),
          coloredHttpCode(resp.statusCode),
          dimGrey(resp.request.options.method),
          grey(resp.request.options.url),
          started && dimGrey('in ' + _since(started)),
        ]
          .filter(Boolean)
          .join(' '),
      )
      // console.log(`afterResp! ${resp.request.options.method} ${resp.url}`, { context: resp.request.options.context })
    }

    // Error responses are not logged, cause they're included in Error message already
    if (opt.logResponse && success) {
      console.log(inspectAny(_jsonParseIfPossible(resp.body), { maxLen: opt.maxResponseLength }))
    }

    return resp
  }
}

function coloredHttpCode(statusCode: number): string {
  if (statusCode < 400) return dimGrey(statusCode) // default
  if (statusCode < 500) return yellow(statusCode)
  return red(statusCode)
}
