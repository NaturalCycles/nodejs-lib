import { Mapper } from '@naturalcycles/js-lib'
import { TransformMapOptions, writableForEach } from '../..'
import { _pipeline } from './pipeline'

/**
 * Wrapper around stream.pipeline() that will run Mapper for each of the items, respecting backpressure.
 */
export async function pipelineForEach<IN>(
  streams: (NodeJS.ReadableStream | NodeJS.WritableStream)[],
  mapper: Mapper<IN, void>,
  opt?: TransformMapOptions,
): Promise<void> {
  await _pipeline([...streams, writableForEach(mapper, opt)])
}
