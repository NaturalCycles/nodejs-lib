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
export function runScript (fn: (...args: any[]) => Promise<any>): void {
  fn()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
