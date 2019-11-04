import { SimpleMovingAverage } from '@naturalcycles/js-lib'
import { since } from '@naturalcycles/time-lib'
import { Transform } from 'stream'
import { inspect } from 'util'
import { boldWhite, mb, yellow } from '../..'
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
   * @default true
   * Set to false to disable logging progress
   */
  logProgress?: boolean

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
  const logProgress = opt.logProgress !== false // true by default
  const logHeapUsed = opt.heapUsed !== false // true by default

  const started = Date.now()
  let lastSecondStarted = Date.now()
  const sma = new SimpleMovingAverage(10) // over last 10 seconds
  let processedLastSecond = 0
  let progress = 0

  logStats() // initial

  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      progress++
      processedLastSecond++

      if (logProgress && progress % logEvery === 0) {
        logStats()
      }

      cb(null, chunk) // pass-through
    },
    final(cb) {
      logStats(true)

      cb()
    },
  })

  function logStats(final = false): void {
    if (!logProgress) return
    const { heapUsed, heapTotal } = process.memoryUsage()

    const now = Date.now()
    const lastRPS = processedLastSecond / ((now - lastSecondStarted) / 1000) || 0
    const rpsTotal = Math.round(progress / ((now - started) / 1000)) || 0
    lastSecondStarted = now
    processedLastSecond = 0

    const rps10 = Math.round(sma.push(lastRPS))

    console.log(
      inspect(
        {
          [metric]: progress,
          ...(logHeapUsed ? { heapUsed: mb(heapUsed) } : {}),
          ...(logHeapTotal ? { heapTotal: mb(heapTotal) } : {}),
          rps10,
          rpsTotal,
        },
        inspectOpt,
      ),
    )

    if (final) {
      console.log(
        `${boldWhite(metric)} took ${yellow(since(started))} to process ${yellow(
          progress,
        )} rows with total RPS of ${yellow(rpsTotal)}`,
      )
    }
  }
}
