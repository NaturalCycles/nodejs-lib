import { since } from '@naturalcycles/time-lib'
import { Transform } from 'stream'
import { inspect } from 'util'
import { dimWhite, mb } from '../..'
import { TransformOpt, TransformTyped } from '../stream.model'

export interface TransformLogProgressOptions extends TransformOpt {
  /**
   * Progress metric
   * @default `progress`
   */
  metric?: string

  /**
   * Include `heapUsed` in log.
   * @default true
   */
  heapUsed?: boolean

  /**
   * Include `heapTotal` in log.
   * @default false
   */
  heapTotal?: boolean

  /**
   * Log progress event Nth record that is _processed_ (went through mapper).
   * @default 100
   */
  logEvery?: number
}

const inspectOpt: NodeJS.InspectOptions = {
  colors: true,
  breakLength: 100,
}

/**
 * Pass-through transform that optionally logs progress.
 */
export function transformLogProgress<IN = any>(
  opt: TransformLogProgressOptions = {},
): TransformTyped<IN, IN> {
  const { metric = 'progress', heapTotal: logHeapTotal = false, logEvery = 100 } = opt
  const logHeapUsed = opt.heapUsed !== false // true by default

  const started = Date.now()
  let progress = 0

  logStats() // initial

  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      progress++

      if (logEvery && progress % logEvery === 0) {
        logStats()
      }

      cb(null, chunk) // pass-through
    },
    final(cb) {
      if (logEvery) {
        logStats(true)
      }

      cb()
    },
  })

  function logStats(final = false): void {
    const { heapUsed, heapTotal } = process.memoryUsage()

    console.log(
      inspect(
        {
          [metric]: progress,
          ...(logHeapUsed ? { heapUsed: mb(heapUsed) } : {}),
          ...(logHeapTotal ? { heapTotal: mb(heapTotal) } : {}),
        },
        inspectOpt,
      ),
    )

    if (final) {
      console.log(`${dimWhite(metric)} finished in ${dimWhite(since(started))}`)
    }
  }
}
