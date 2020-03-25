import { dimGrey, mb, SlackSharedService, yellow } from '..'

export interface RunScriptOptions {
  /**
   * If defined (milliseconds) - will do a setInterval with a timer that will log heapUsed.
   */
  memoryInterval?: number
}

/**
 * Use it in your top-level scripts like this:
 *
 * runScript(async () => {
 *   await lalala()
 *   // my script goes on....
 * })
 *
 * Advantages:
 * - Works kind of like top-level await
 * - No need to add `void`
 * - No need to add `.then(() => process.exit()` (e.g to close DB connections)
 * - No need to add `.catch(err => { console.error(err); process.exit(1) })`
 * - Supports automatic failure reporting to Slack (!)
 */
export function runScript(fn: (...args: any[]) => any, opt: RunScriptOptions = {}): void {
  process.on('uncaughtException', err => {
    console.error('uncaughtException', err)
  })
  process.on('unhandledRejection', err => {
    console.error('unhandledRejection', err)
  })

  const { memoryInterval } = opt

  if (memoryInterval) {
    setInterval(logMemory, memoryInterval)
  }

  void (async () => {
    try {
      await fn()
      setImmediate(() => process.exit(0))
    } catch (err) {
      console.error('runScript failed:', err)

      onFailure(err)

      process.exitCode = 1
    }
  })()
}

function onFailure(err: Error): void {
  const { SLACK_ON_FAILURE, SLACK_WEBHOOK_URL } = process.env

  if (!SLACK_ON_FAILURE) return

  if (!SLACK_WEBHOOK_URL) {
    return console.warn(yellow(`env.SLACK_WEBHOOK_URL is missing, unable to slack on failure`))
  }

  const slack = new SlackSharedService({
    webhookUrl: SLACK_WEBHOOK_URL,
  })

  const channel = SLACK_ON_FAILURE

  void slack
    .sendMsg({
      text: err,
      channel,
      noLog: true, // cause we logged the error already
      throwOnError: true,
    })
    .then(() => {
      console.log(dimGrey(`slacked the error to channel: ${channel}`))
    })
    .catch(_err => {
      console.log(yellow(`failed to slack the error to channel: ${channel}`))
      console.error(_err)
    })
}

function logMemory(): void {
  const { heapUsed } = process.memoryUsage()
  console.log({
    heapUsed: mb(heapUsed),
  })
}
