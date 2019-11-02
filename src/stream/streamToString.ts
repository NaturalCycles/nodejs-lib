import { pipelineToArray } from './pipeline/pipelineToArray'
import { ReadableTyped } from './stream.model'

export async function streamToString(
  stream: ReadableTyped<string | Buffer>,
  joinOn = '',
): Promise<string> {
  const chunks = await pipelineToArray<string | Buffer>([stream], { objectMode: false })

  return chunks
    .filter(Boolean)
    .map(String)
    .join(joinOn)
}
