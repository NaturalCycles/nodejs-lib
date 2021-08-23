import { AsyncMapper } from '@naturalcycles/js-lib'
import { transformMap, writablePushToArray, _pipeline } from '../../index'
import { ReadableTyped } from '../stream.model'
import { TransformMapOptions } from '../transform/transformMap'

/**
 * Map Readable items to array of results (in memory),
 * passing each result via `transformMap`.
 *
 * Warning! All results are stored in memory (no backpressure).
 */
export async function readableMapToArray<IN, OUT = IN>(
  stream: ReadableTyped<IN>,
  mapper: AsyncMapper<IN, OUT> = item => item as any,
  opt?: TransformMapOptions<IN, OUT>,
): Promise<OUT[]> {
  const res: OUT[] = []

  await _pipeline([stream, transformMap(mapper, opt), writablePushToArray(res)])

  return res
}
