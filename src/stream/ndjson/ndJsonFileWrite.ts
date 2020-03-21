import { readableFromArray } from '../readable/readableFromArray'
import { pipelineToNDJsonFile, PipelineToNDJsonFileOptions } from './pipelineToNDJsonFile'

/**
 * Write array of objects (in memory) into NDJSON file. Resolve when done.
 */
export async function ndJsonFileWrite<IN = any>(
  items: IN[],
  opt: PipelineToNDJsonFileOptions,
): Promise<void> {
  await pipelineToNDJsonFile([readableFromArray(items)], opt)
}
