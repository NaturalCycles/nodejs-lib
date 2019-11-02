import { ReadableTyped } from '../stream.model'
import { pipelineToNDJsonFile, PipelineToNDJsonFileOptions } from './pipelineToNDJsonFile'

export async function streamToNDJsonFile<IN>(
  stream: ReadableTyped<IN>,
  opt: PipelineToNDJsonFileOptions,
): Promise<void> {
  await pipelineToNDJsonFile([stream], opt)
}
