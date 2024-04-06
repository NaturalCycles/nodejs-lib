import { inspect, InspectOptions } from 'node:util'
import {
  _mb,
  _since,
  AnyObject,
  CommonLogger,
  localTimeNow,
  SimpleMovingAverage,
  UnixTimestampMillisNumber,
} from '@naturalcycles/js-lib'
import { boldWhite, dimGrey, hasColors, white, yellow } from '../colors/colors'
import { SizeStack } from './sizeStack'

export interface ProgressLoggerCfg<IN = any> {
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

  logger?: CommonLogger

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

  /**
   * Experimental logging of item (shunk) sizes, when json-stringified.
   *
   * Defaults to false.
   *
   * @experimental
   */
  logSizes?: boolean

  /**
   * How many last item sizes to keep in a buffer, to calculate stats (p50, p90, avg, etc).
   * Defaults to 100_000.
   * Cannot be Infinity.
   */
  logSizesBuffer?: number

  /**
   * Works in addition to `logSizes`. Adds "zipped sizes".
   *
   * @experimental
   */
  logZippedSizes?: boolean
}

export interface ProgressLogItem extends AnyObject {
  heapUsed?: number
  heapTotal?: number
  rss?: number
  peakRSS?: number
  rssMinusHeap?: number
  external?: number
  arrayBuffers?: number
  rps10?: number
  rpsTotal?: number
}

const inspectOpt: InspectOptions = {
  colors: hasColors,
  breakLength: 300,
}

export class ProgressLogger<IN> implements Disposable {
  constructor(cfg: ProgressLoggerCfg<IN> = {}) {
    this.cfg = {
      metric: 'progress',
      rss: true,
      peakRSS: true,
      logRPS: true,
      logEvery: 1000,
      logSizesBuffer: 100_000,
      batchSize: 1,
      logger: console,
      logProgress: cfg.logProgress !== false && cfg.logEvery !== 0,
      ...cfg,
    }
    this.logEvery10 = this.cfg.logEvery * 10

    this.start()
    this.logStats() // initial
  }

  cfg!: ProgressLoggerCfg<IN> & {
    logEvery: number
    logSizesBuffer: number
    batchSize: number
    metric: string
    logger: CommonLogger
  }

  private started!: UnixTimestampMillisNumber
  private lastSecondStarted!: UnixTimestampMillisNumber
  private sma!: SimpleMovingAverage
  private logEvery10!: number
  private processedLastSecond!: number
  private progress!: number
  private peakRSS!: number
  private sizes?: SizeStack
  private sizesZipped?: SizeStack

  private start(): void {
    this.started = Date.now()
    this.lastSecondStarted = Date.now()
    this.sma = new SimpleMovingAverage(10)
    this.processedLastSecond = 0
    this.progress = 0
    this.peakRSS = 0
    this.sizes = this.cfg.logSizes ? new SizeStack('json', this.cfg.logSizesBuffer) : undefined
    this.sizesZipped = this.cfg.logZippedSizes
      ? new SizeStack('json.gz', this.cfg.logSizesBuffer)
      : undefined
  }

  log(chunk?: IN): void {
    this.progress++
    this.processedLastSecond++

    if (this.sizes) {
      // Check it, cause gzipping might be delayed here..
      void SizeStack.countItem(chunk, this.cfg.logger, this.sizes, this.sizesZipped)
    }

    if (this.cfg.logProgress && this.progress % this.cfg.logEvery === 0) {
      this.logStats(chunk, false, this.progress % this.logEvery10 === 0)
    }
  }

  done(): void {
    this.logStats(undefined, true)
  }

  [Symbol.dispose](): void {
    this.done()
  }

  private logStats(chunk?: IN, final = false, tenx = false): void {
    if (!this.cfg.logProgress) return

    const {
      metric,
      extra,
      batchSize,
      heapUsed: logHeapUsed,
      heapTotal: logHeapTotal,
      rss: logRss,
      peakRSS: logPeakRss,
      rssMinusHeap,
      external,
      arrayBuffers,
      logRPS,
      logger,
    } = this.cfg

    const mem = process.memoryUsage()

    const now = Date.now()
    const batchedProgress = this.progress * batchSize
    const lastRPS =
      (this.processedLastSecond * batchSize) / ((now - this.lastSecondStarted) / 1000) || 0
    const rpsTotal = Math.round(batchedProgress / ((now - this.started) / 1000)) || 0
    this.lastSecondStarted = now
    this.processedLastSecond = 0

    const rps10 = Math.round(this.sma.pushGetAvg(lastRPS))
    if (mem.rss > this.peakRSS) this.peakRSS = mem.rss

    const o: ProgressLogItem = {
      [final ? `${this.cfg.metric}_final` : this.cfg.metric]: batchedProgress,
    }

    if (extra) Object.assign(o, extra(chunk, this.progress))
    if (logHeapUsed) o.heapUsed = _mb(mem.heapUsed)
    if (logHeapTotal) o.heapTotal = _mb(mem.heapTotal)
    if (logRss) o.rss = _mb(mem.rss)
    if (logPeakRss) o.peakRSS = _mb(this.peakRSS)
    if (rssMinusHeap) o.rssMinusHeap = _mb(mem.rss - mem.heapTotal)
    if (external) o.external = _mb(mem.external)
    if (arrayBuffers) o.arrayBuffers = _mb(mem.arrayBuffers || 0)

    if (logRPS) Object.assign(o, { rps10, rpsTotal })

    logger.log(inspect(o, inspectOpt))

    if (this.sizes?.items.length) {
      logger.log(this.sizes.getStats())

      if (this.sizesZipped?.items.length) {
        logger.log(this.sizesZipped.getStats())
      }
    }

    if (tenx) {
      let perHour: number | string =
        Math.round((batchedProgress * 1000 * 60 * 60) / (now - this.started)) || 0
      if (perHour > 900) {
        perHour = Math.round(perHour / 1000) + 'K'
      }

      logger.log(
        `${dimGrey(localTimeNow().toPretty())} ${white(metric)} took ${yellow(
          _since(this.started),
        )} so far to process ${yellow(batchedProgress)} rows, ~${yellow(perHour)}/hour`,
      )
    } else if (final) {
      logger.log(
        `${boldWhite(metric)} took ${yellow(_since(this.started))} to process ${yellow(
          batchedProgress,
        )} rows with total RPS of ${yellow(rpsTotal)}`,
      )
    }
  }
}

/**
 * Create new ProgressLogger.
 */
export function progressLogger<IN>(cfg: ProgressLoggerCfg<IN> = {}): ProgressLogger<IN> {
  return new ProgressLogger(cfg)
}
