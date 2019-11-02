import { transformMap } from '../transform/transformMap'
import { pipelineFromNDJsonFile, PipelineFromNDJsonFileOptions } from './pipelineFromNDJsonFile'

/**
 * Read whole NDJSON file into memory, resolve promise with resulting array of items.
 */
export async function ndJsonFileRead<OUT = any>(
  opt: PipelineFromNDJsonFileOptions,
): Promise<OUT[]> {
  const res: OUT[] = []

  await pipelineFromNDJsonFile([transformMap(r => res.push(r))], opt)

  return res
}
