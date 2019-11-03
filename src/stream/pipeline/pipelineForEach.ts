import { Mapper, passNothingPredicate } from '@naturalcycles/js-lib'
import { transformMap, TransformMapOptions } from '../..'
import { _pipeline } from './pipeline'

/**
 * Wrapper around stream.pipeline() that will run Mapper for each of the items, respecting backpressure.
 */
export async function pipelineForEach<IN>(
  streams: (NodeJS.ReadableStream | NodeJS.WritableStream)[],
  mapper: Mapper<IN, any>,
  opt?: TransformMapOptions,
): Promise<void> {
  await _pipeline([...streams, transformMap(mapper, { ...opt, predicate: passNothingPredicate })])
}
