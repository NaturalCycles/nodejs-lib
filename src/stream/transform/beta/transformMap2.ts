import { Transform } from 'stream'
import {
  AggregatedError,
  AsyncMapper,
  CommonLogger,
  ErrorMode,
  pFilter,
  PQueue,
} from '@naturalcycles/js-lib'
import { yellow } from '../../../colors'
import { TransformTyped } from '../../stream.model'
import { TransformMapOptions } from '../transformMap'

export function notNullishPredicate(item: any): boolean {
  return item !== undefined && item !== null
}

/**
 * Like pMap, but for streams.
 * Inspired by `through2`.
 * Main feature is concurrency control (implemented via `through2-concurrent`) and convenient options.
 * Using this allows native stream .pipe() to work and use backpressure.
 *
 * Only works in objectMode (due to through2Concurrent).
 *
 * Concurrency defaults to 16.
 *
 * If an Array is returned by `mapper` - it will be flattened and multiple results will be emitted from it. Tested by Array.isArray().
 */
export function transformMap2<IN = any, OUT = IN>(
  mapper: AsyncMapper<IN, OUT>,
  opt: TransformMapOptions<IN, OUT> = {},
): TransformTyped<IN, OUT> {
  const {
    concurrency = 16,
    predicate = notNullishPredicate,
    errorMode = ErrorMode.THROW_IMMEDIATELY,
    flattenArrayOutput,
    onError,
    beforeFinal,
    metric = 'stream',
    logger = console,
  } = opt

  let index = -1
  let isRejected = false
  let errors = 0
  const collectedErrors: Error[] = [] // only used if errorMode == THROW_AGGREGATED

  const q = new PQueue({
    concurrency,
    resolveOn: 'start',
    // debug: true,
  })

  return new Transform({
    objectMode: true,

    async final(cb) {
      // console.log('transformMap final', {index}, q.inFlight, q.queueSize)

      // wait for the current inFlight jobs to complete and push their results
      await q.onIdle()

      logErrorStats(logger, true)

      await beforeFinal?.() // call beforeFinal if defined

      if (collectedErrors.length) {
        // emit Aggregated error
        cb(new AggregatedError(collectedErrors))
      } else {
        // emit no error
        cb()
      }
    },

    async transform(this: Transform, chunk: IN, _encoding, cb) {
      index++
      // console.log('transform', {index})

      // Stop processing if THROW_IMMEDIATELY mode is used
      if (isRejected && errorMode === ErrorMode.THROW_IMMEDIATELY) return cb()

      let calledBack = false

      // Allow up to 1 x concurrency "buffer" (aka highWatermark)
      if (q.queueSize < concurrency) {
        cb()
        calledBack = true
      }

      await q.push(async () => {
        try {
          const currentIndex = index // because we need to pass it to 2 functions - mapper and predicate. Refers to INPUT index (since it may return multiple outputs)
          const res = await mapper(chunk, currentIndex)
          const passedResults = await pFilter(
            flattenArrayOutput && Array.isArray(res) ? res : [res],
            async r => await predicate(r, currentIndex),
          )

          passedResults.forEach(r => this.push(r))
        } catch (err) {
          logger.error(err)

          errors++

          logErrorStats(logger)

          if (onError) {
            try {
              onError(err, chunk)
            } catch {}
          }

          if (errorMode === ErrorMode.THROW_IMMEDIATELY) {
            isRejected = true
            // Emit error immediately
            // return cb(err as Error)
            return this.emit('error', err as Error)
          }

          if (errorMode === ErrorMode.THROW_AGGREGATED) {
            collectedErrors.push(err as Error)
          }
        }
      })

      // Resolved, which means it STARTED processing
      // This means we can take more load
      if (!calledBack) {
        cb()
      }
    },
  })

  function logErrorStats(logger: CommonLogger, final = false): void {
    if (!errors) return

    logger.log(`${metric} ${final ? 'final ' : ''}errors: ${yellow(errors)}`)
  }
}
