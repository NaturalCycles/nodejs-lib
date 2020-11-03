export interface RunScriptOptions {
  /**
   * @default false
   * Set to true to NOT call process.exit(0) after function is completed.
   * Currently it exists because of `jest --maxWorkers=1` behavior. To be investigated more..
   */
  noExit?: boolean
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
 *
 * This function is kept light, dependency-free, exported separately.
 */
export function runScript(fn: (...args: any[]) => any, opt: RunScriptOptions = {}): void {
  process.on('uncaughtException', err => {
    console.error('uncaughtException', err)
  })
  process.on('unhandledRejection', err => {
    console.error('unhandledRejection', err)
  })

  void (async () => {
    try {
      await fn()

      if (!opt.noExit) {
        setImmediate(() => process.exit(0))
      }
    } catch (err) {
      console.error('runScript failed:', err)
      process.exitCode = 1
      if (!opt.noExit) {
        setImmediate(() => process.exit(1))
      }
    }
  })()
}
