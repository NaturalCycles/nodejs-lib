import { Transform } from 'stream'
import { inspect, InspectOptions } from 'util'
import { SimpleMovingAverage, _mb, _since, AnyObject } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { boldWhite, dimGrey, white, yellow } from '../../colors'
import { hasColors } from '../../colors/colors'
import { TransformOptions, TransformTyped } from '../stream.model'

export interface TransformLogProgressOptions<IN = any> extends TransformOptions {
  /**
   * Progress metric
   *
   * @default `progress`
   */
  metric?: string

  /**
   * Include `heapUsed` in log.
   *
   * @default false
   */
  heapUsed?: boolean

  /**
   * Include `heapTotal` in log.
   *
   * @default false
   */
  heapTotal?: boolean

  /**
   * Include `rss` in log.
   *
   * @default true
   */
  rss?: boolean

  /**
   * Incude Peak RSS in log.
   *
   * @default true
   */
  peakRSS?: boolean

  /**
   * Include `external` in log.
   *
   * @default false
   */
  external?: boolean

  /**
   * Include `arrayBuffers` in log.
   *
   * @default false
   */
  arrayBuffers?: boolean

  /**
   * Log (rss - heapTotal)
   * For convenience of debugging "out-of-heap" memory size.
   *
   * @default false
   */
  rssMinusHeap?: boolean

  /**
   * Log "rows per second"
   *
   * @default true
   */
  logRPS?: boolean

  /**
   * Set to false to disable logging progress
   *
   * @default true
   */
  logProgress?: boolean

  /**
   * Log progress event Nth record that is _processed_ (went through mapper).
   * Set to 0 to disable logging.
   *
   * @default 1000
   */
  logEvery?: number

  /**
   * Function to return extra properties to the "progress object".
   *
   * chunk is undefined for "final" stats, otherwise is defined.
   */
  extra?: (chunk: IN | undefined, index: number) => AnyObject

  /**
   * If specified - will multiply the counter by this number.
   * Useful e.g when using `transformBuffer({ batchSize: 500 })`, so
   * it'll accurately represent the number of processed entries (not batches).
   *
   * Defaults to 1.
   */
  batchSize?: number
}

const inspectOpt: InspectOptions = {
  colors: hasColors,
  breakLength: 300,
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
    heapUsed: logHeapUsed = false,
    rss: logRss = true,
    peakRSS: logPeakRSS = true,
    logRPS = true,
    logEvery = 1000,
    batchSize = 1,
    extra,
  } = opt
  const logProgress = opt.logProgress !== false && logEvery !== 0 // true by default
  const logEvery10 = logEvery * 10

  const started = Date.now()
  let lastSecondStarted = Date.now()
  const sma = new SimpleMovingAverage(10) // over last 10 seconds
  let processedLastSecond = 0
  let progress = 0
  let peakRSS = 0

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
    const batchedProgress = progress * batchSize
    const lastRPS = (processedLastSecond * batchSize) / ((now - lastSecondStarted) / 1000) || 0
    const rpsTotal = Math.round(batchedProgress / ((now - started) / 1000)) || 0
    lastSecondStarted = now
    processedLastSecond = 0

    const rps10 = Math.round(sma.push(lastRPS))
    if (mem.rss > peakRSS) peakRSS = mem.rss

    console.log(
      inspect(
        {
          [final ? `${metric}_final` : metric]: batchedProgress,
          ...(extra ? extra(chunk, progress) : {}),
          ...(logHeapUsed ? { heapUsed: _mb(mem.heapUsed) } : {}),
          ...(logHeapTotal ? { heapTotal: _mb(mem.heapTotal) } : {}),
          ...(logRss ? { rss: _mb(mem.rss) } : {}),
          ...(logPeakRSS ? { peakRSS: _mb(peakRSS) } : {}),
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
      let perHour: number | string =
        Math.round((batchedProgress * 1000 * 60 * 60) / (now - started)) || 0
      if (perHour > 900) {
        perHour = Math.round(perHour / 1000) + 'K'
      }

      console.log(
        `${dimGrey(dayjs().toPretty())} ${white(metric)} took ${yellow(
          _since(started),
        )} so far to process ${yellow(batchedProgress)} rows, ~${yellow(perHour)}/hour`,
      )
    } else if (final) {
      console.log(
        `${boldWhite(metric)} took ${yellow(_since(started))} to process ${yellow(
          batchedProgress,
        )} rows with total RPS of ${yellow(rpsTotal)}`,
      )
    }
  }
}
