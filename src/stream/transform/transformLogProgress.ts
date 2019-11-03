import { since } from '@naturalcycles/time-lib'
import { Transform } from 'stream'
import { inspect } from 'util'
import { mb } from '../..'
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
   * Interval in milliseconds to print progress stats
   *
   * If defined - will log progress in a format like:
   * {read: 10, processed: 4, errors: 0, heapUsed: 47, rps:4, rpsTotal: 3}
   *
   * @default undefined
   */
  logProgressInterval?: number

  /**
   * Log progress event Nth record that is _processed_ (went through mapper).
   */
  logProgressCount?: number
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
  const {
    metric = 'progress',
    heapTotal: logHeapTotal = false,
    logProgressInterval,
    logProgressCount,
  } = opt
  const logHeapUsed = opt.heapUsed !== false // true by default

  const started = Date.now()
  let progress = 0
  const interval = logProgressInterval ? setInterval(logStats, logProgressInterval) : undefined

  logStats() // initial

  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      progress++

      if (logProgressCount && progress % logProgressCount === 0) {
        logStats()
      }

      cb(null, chunk) // pass-through
    },
    final(cb) {
      if (logProgressInterval || logProgressCount) {
        logStats(true)
      }

      if (interval) {
        clearInterval(interval)
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
      console.log(`stream finished in ${since(started)}`)
    }
  }
}
