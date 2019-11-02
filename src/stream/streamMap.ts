import { Mapper } from '@naturalcycles/js-lib'
import { _pipeline } from './pipeline/pipeline'
import { ReadableTyped } from './stream.model'
import { transformMap, TransformMapOptions } from './transform/transformMap'
import { transformPushToArray } from './transform/transformPushToArray'

/**
 * Run Mapper for each of the stream items, respecting backpressure. Returns array of mapped items.
 */
export async function streamMap<IN, OUT>(
  stream: ReadableTyped<IN>,
  mapper: Mapper<IN, OUT>,
  opt?: TransformMapOptions,
): Promise<OUT[]> {
  const res: OUT[] = []

  await _pipeline([stream, transformMap(mapper, opt), transformPushToArray(res)])

  return res
}
