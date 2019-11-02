import { Mapper } from '@naturalcycles/js-lib'
import { _pipeline } from './pipeline/pipeline'
import { ReadableTyped } from './stream.model'
import { transformMap, TransformMapOptions } from './transform/transformMap'
import { transformPushToArray } from './transform/transformPushToArray'

/**
 * Map stream items to array of results (in memory).
 * Warning! All results are stored in memory (no backpressure).
 */
export async function streamMapToArray<IN, OUT = IN>(
  stream: ReadableTyped<IN>,
  mapper: Mapper<IN, OUT> = item => item as any,
  opt?: TransformMapOptions,
): Promise<OUT[]> {
  const res: OUT[] = []

  await _pipeline([stream, transformMap(mapper, opt), transformPushToArray(res)])

  return res
}
