import { Mapper } from '@naturalcycles/js-lib'
import { _pipeline } from './pipeline/pipeline'
import { ReadableTyped } from './stream.model'
import { transformMap, TransformMapOptions } from './transform/transformMap'

/**
 * Run Mapper for each of the stream items, respecting backpressure.
 */
export async function streamForEach<IN, OUT>(
  stream: ReadableTyped<IN>,
  mapper: Mapper<IN, OUT>,
  opt?: TransformMapOptions,
): Promise<void> {
  await _pipeline([stream, transformMap(mapper, opt)])
}
