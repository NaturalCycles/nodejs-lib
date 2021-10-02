import { Transform } from 'stream'
import { AggregatedError, ErrorMode, Mapper, Predicate } from '@naturalcycles/js-lib'
import { yellow } from '../../colors'
import { TransformTyped } from '../stream.model'
import { notNullishPredicate } from './transformMap'

export interface TransformMapSyncOptions<IN = any, OUT = IN> {
  /**
   * @default true
   */
  objectMode?: boolean

  /**
   * @default false
   * Set true to support "multiMap" - possibility to return [] and emit 1 result for each item in the array.
   */
  flattenArrayOutput?: boolean

  /**
   * Predicate to filter outgoing results (after mapper).
   * Allows to not emit all results.
   *
   * @default to filter out undefined/null values, but pass anything else
   *
   * Set to `r => r` (passthrough predicate) to pass ANY value (including undefined/null)
   */
  predicate?: Predicate<OUT>

  /**
   * @default THROW_IMMEDIATELY
   */
  errorMode?: ErrorMode

  /**
   * If defined - will be called on every error happening in the stream.
   * Called BEFORE observable will emit error (unless skipErrors is set to true).
   */
  onError?: (err: unknown, input: IN) => any

  /**
   * Progress metric
   *
   * @default `stream`
   */
  metric?: string
}

/**
 * Sync (not async) version of transformMap.
 * Supposedly faster, for cases when async is not needed.
 */
export function transformMapSync<IN = any, OUT = IN>(
  mapper: Mapper<IN, OUT>,
  opt: TransformMapSyncOptions = {},
): TransformTyped<IN, OUT> {
  let index = -1

  const {
    predicate = notNullishPredicate,
    errorMode = ErrorMode.THROW_IMMEDIATELY,
    flattenArrayOutput = false,
    onError,
    metric = 'stream',
    objectMode = true,
  } = opt
  let isRejected = false
  let errors = 0
  const collectedErrors: Error[] = [] // only used if errorMode == THROW_AGGREGATED

  return new Transform({
    objectMode,
    ...opt,
    transform(this: Transform, chunk: IN, _encoding, cb) {
      // Stop processing if THROW_IMMEDIATELY mode is used
      if (isRejected && errorMode === ErrorMode.THROW_IMMEDIATELY) {
        return cb()
      }

      try {
        if (!predicate(chunk, ++index)) {
          cb() // signal that we've finished processing, but emit no output here
          return
        }

        // map and pass through
        const v = mapper(chunk, index)

        if (flattenArrayOutput && Array.isArray(v)) {
          // Pass each item individually
          v.forEach(item => this.push(item))
        } else {
          cb(null, v)
        }
      } catch (err) {
        console.error(err)
        errors++

        logErrorStats()

        if (onError) {
          try {
            onError(err, chunk)
          } catch {}
        }

        if (errorMode === ErrorMode.THROW_IMMEDIATELY) {
          isRejected = true
          // Emit error immediately
          return cb(err as Error)
        }

        if (errorMode === ErrorMode.THROW_AGGREGATED) {
          collectedErrors.push(err as Error)
        }

        cb()
      }
    },
    final(cb) {
      // console.log('transformMap final')

      logErrorStats(true)

      if (collectedErrors.length) {
        // emit Aggregated error
        cb(new AggregatedError(collectedErrors))
      } else {
        // emit no error
        cb()
      }
    },
  })

  function logErrorStats(final = false): void {
    if (!errors) return

    console.log(`${metric} ${final ? 'final ' : ''}errors: ${yellow(errors)}`)
  }
}
