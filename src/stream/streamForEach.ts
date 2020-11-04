import { AsyncMapper, _passthroughPredicate } from '@naturalcycles/js-lib'
import { ReadableTyped, transformLogProgress, transformMap, writableVoid } from '../index'
import { _pipeline } from './pipeline/pipeline'
import { StreamForEachOptions } from './stream.model'

/**
 * Wrapper around stream.pipeline() that will run Mapper for each of the items, respecting backpressure.
 */
export async function streamForEach<IN>(
  streams: ReadableTyped<IN> | (NodeJS.ReadableStream | NodeJS.WritableStream)[],
  mapper: AsyncMapper<IN, void>,
  opt?: StreamForEachOptions<IN>,
): Promise<void> {
  await _pipeline([
    ...(Array.isArray(streams) ? streams : [streams]),
    transformMap(mapper, {
      ...opt,
      predicate: _passthroughPredicate,
    }),
    transformLogProgress(opt),
    writableVoid(),
  ])
}
