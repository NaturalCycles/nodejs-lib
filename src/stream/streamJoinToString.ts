import { pipelineToArray } from './pipeline/pipelineToArray'
import { ReadableTyped } from './stream.model'

export async function streamJoinToString(
  stream: ReadableTyped<string | Buffer>,
  joinOn = '',
): Promise<string> {
  const chunks = await pipelineToArray<string | Buffer>([stream], { objectMode: false })

  // eslint-disable-next-line unicorn/no-array-callback-reference
  return chunks.filter(Boolean).map(String).join(joinOn)
}
