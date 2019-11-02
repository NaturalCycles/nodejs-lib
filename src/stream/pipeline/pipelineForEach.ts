import { Mapper } from '@naturalcycles/js-lib'
import { transformMap, TransformMapOptions } from '../transform/transformMap'
import { _pipeline } from './pipeline'

/**
 * Wrapper around stream.pipeline() that will run Mapper for each of the items, respecting backpressure.
 */
export async function pipelineForEach<IN, OUT>(
  streams: (NodeJS.ReadableStream | NodeJS.WritableStream)[],
  mapper: Mapper<IN, OUT>,
  opt?: TransformMapOptions,
): Promise<void> {
  await _pipeline([...streams, transformMap(mapper, opt)])
}
