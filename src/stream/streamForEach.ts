import { Mapper } from '@naturalcycles/js-lib'
import { writableForEach } from '..'
import { _pipeline } from './pipeline/pipeline'
import { ReadableTyped } from './stream.model'
import { TransformMapOptions } from './transform/transformMap'

/**
 * Run Mapper for each of the stream items, respecting backpressure.
 */
export async function streamForEach<IN>(
  stream: ReadableTyped<IN>,
  mapper: Mapper<IN, void>,
  opt?: TransformMapOptions<IN, void>,
): Promise<void> {
  await _pipeline([stream, writableForEach(mapper, opt)])
}
