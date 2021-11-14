import { Transform } from 'stream'
import {
  AggregatedError,
  AsyncMapper,
  CommonLogger,
  ErrorMode,
  pFilter,
} from '@naturalcycles/js-lib'
import through2Concurrent = require('through2-concurrent')
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
export function transformMapLegacy<IN = any, OUT = IN>(
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

  return through2Concurrent.obj(
    {
      maxConcurrency: concurrency,
      // autoDestroy: true,
      async final(cb) {
        // console.log('transformMap final')

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
    },
    async function transformMapFn(
      this: Transform,
      chunk: IN,
      _encoding: any,
      cb: (...args: any[]) => any,
    ) {
      index++
      // console.log({chunk, _encoding})

      // Stop processing if THROW_IMMEDIATELY mode is used
      if (isRejected && errorMode === ErrorMode.THROW_IMMEDIATELY) return cb()

      try {
        const currentIndex = index // because we need to pass it to 2 functions - mapper and predicate. Refers to INPUT index (since it may return multiple outputs)
        const res = await mapper(chunk, currentIndex)
        const passedResults = await pFilter(
          flattenArrayOutput && Array.isArray(res) ? res : [res],
          async r => await predicate(r, currentIndex),
        )

        if (passedResults.length === 0) {
          cb() // 0 results
        } else {
          passedResults.forEach(r => {
            this.push(r)
            // cb(null, r)
          })
          cb() // done processing
        }
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
          return cb(err)
        }

        if (errorMode === ErrorMode.THROW_AGGREGATED) {
          collectedErrors.push(err as Error)
        }

        // Tell input stream that we're done processing, but emit nothing to output - not error nor result
        cb()
      }
    },
  )

  function logErrorStats(logger: CommonLogger, final = false): void {
    if (!errors) return

    logger.log(`${metric} ${final ? 'final ' : ''}errors: ${yellow(errors)}`)
  }
}
