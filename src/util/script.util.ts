import { mb } from '..'

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
      console.error(err)
      process.exit(1)
    }
  })()
}

function logMemory(): void {
  const { heapUsed } = process.memoryUsage()
  console.log({
    heapUsed: mb(heapUsed),
  })
}
