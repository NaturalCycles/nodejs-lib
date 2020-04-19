import { SimpleMovingAverage, _mb, _since } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { Transform } from 'stream'
import { inspect } from 'util'
import { boldWhite, dimGrey, white, yellow } from '../../colors'
import { TransformOpt, TransformTyped } from '../stream.model'

export interface TransformLogProgressOptions<IN = any> extends TransformOpt {
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
   * Include `rss` in log.
   * @default true
   */
  rss?: boolean

  /**
   * Include `external` in log.
   * @default false
   */
  external?: boolean

  /**
   * Include `arrayBuffers` in log.
   * @default false
   */
  arrayBuffers?: boolean

  /**
   * Log (rss - heapTotal)
   * For convenience of debugging "out-of-heap" memory size.
   * @default false
   */
  rssMinusHeap?: boolean

  /**
   * Log "rows per second"
   * @default true
   */
  logRPS?: boolean

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

  /**
   * Function to return extra properties to the "progress object".
   */
  extra?: (chunk: IN, index: number) => object
}

const inspectOpt: NodeJS.InspectOptions = {
  colors: true,
  breakLength: 200,
}

/**
 * Pass-through transform that optionally logs progress.
 */
export function transformLogProgress<IN = any>(
  opt: TransformLogProgressOptions = {},
): TransformTyped<IN, IN> {
  const { metric = 'progress', heapTotal: logHeapTotal = false, logEvery = 100, extra } = opt
  const logProgress = opt.logProgress !== false // true by default
  const logHeapUsed = opt.heapUsed !== false // true by default
  const logRss = opt.rss !== false // true by default
  const logRPS = opt.logRPS !== false // true by default
  const logEvery10 = logEvery * 10

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
        logStats(chunk, false, progress % logEvery10 === 0)
      }

      cb(null, chunk) // pass-through
    },
    final(cb) {
      logStats(undefined, true)

      cb()
    },
  })

  function logStats(chunk?: IN, final = false, tenx = false): void {
    if (!logProgress) return
    const mem = process.memoryUsage()

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
          ...(extra && !final ? extra(chunk, progress) : {}),
          ...(logHeapUsed ? { heapUsed: _mb(mem.heapUsed) } : {}),
          ...(logHeapTotal ? { heapTotal: _mb(mem.heapTotal) } : {}),
          ...(logRss ? { rss: _mb(mem.rss) } : {}),
          ...(opt.rssMinusHeap ? { rssMinusHeap: _mb(mem.rss - mem.heapTotal) } : {}),
          ...(opt.external ? { external: _mb(mem.external) } : {}),
          ...(opt.arrayBuffers ? { arrayBuffers: _mb(mem.arrayBuffers || 0) } : {}),
          ...(logRPS
            ? {
                rps10,
                rpsTotal,
              }
            : {}),
        },
        inspectOpt,
      ),
    )

    if (tenx) {
      let perHour: number | string = Math.round((progress * 1000 * 60 * 60) / (now - started)) || 0
      if (perHour > 900) {
        perHour = Math.round(perHour / 1000) + 'K'
      }

      console.log(
        `${dimGrey(dayjs().toPretty())} ${white(metric)} took ${yellow(
          _since(started),
        )} so far to process ${yellow(progress)} rows, ~${yellow(perHour)}/hour`,
      )
    } else if (final) {
      console.log(
        `${boldWhite(metric)} took ${yellow(_since(started))} to process ${yellow(
          progress,
        )} rows with total RPS of ${yellow(rpsTotal)}`,
      )
    }
  }
}
