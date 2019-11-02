import { TransformOpt } from '../stream.model'
import { transformPushToArray } from '../transform/transformPushToArray'
import { _pipeline } from './pipeline'

/**
 * Wrapper around stream.pipeline() that will collect all results as array and emit it with Promise in the end.
 * Will throw on error.
 */
export async function pipelineToArray<OUT = any>(
  streams: (NodeJS.ReadableStream | NodeJS.WritableStream)[],
  opt?: TransformOpt,
): Promise<OUT[]> {
  const res: OUT[] = []

  await _pipeline([...streams, transformPushToArray<OUT>(res, opt)])

  return res
}
