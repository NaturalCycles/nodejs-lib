import { AsyncMapper } from '@naturalcycles/js-lib'
import { _pipeline } from './pipeline/pipeline'
import { ReadableTyped } from './stream.model'
import { transformMap, TransformMapOptions } from './transform/transformMap'
import { writablePushToArray } from './writable/writablePushToArray'

/**
 * Map stream items to array of results (in memory).
 * Warning! All results are stored in memory (no backpressure).
 */
export async function streamMapToArray<IN, OUT = IN>(
  stream: ReadableTyped<IN>,
  mapper: AsyncMapper<IN, OUT> = item => item as any,
  opt?: TransformMapOptions<IN, OUT>,
): Promise<OUT[]> {
  const res: OUT[] = []

  await _pipeline([stream, transformMap(mapper, opt), writablePushToArray(res)])

  return res
}
