import * as fs from 'fs'
import { createUnzip, ZlibOptions } from 'zlib'
import { _pipeline } from '../..'
import { transformSplit } from '../transform/transformSplit'
import { transformJsonParse, TransformJsonParseOptions } from './transformJsonParse'

export interface PipelineFromNDJsonFileOptions extends TransformJsonParseOptions {
  filePath: string

  /**
   * @default `\n`
   */
  separator?: string

  /**
   * @default false
   */
  gzip?: boolean

  /**
   * Only applicable if `gzip` is enabled
   */
  zlibOptions?: ZlibOptions
}

/**
 * Convenience pipeline that starts from reading NDJSON file.
 */
export async function pipelineFromNDJsonFile(
  streams: NodeJS.WritableStream[],
  opt: PipelineFromNDJsonFileOptions,
): Promise<void> {
  const { filePath, gzip, separator } = opt

  await _pipeline([
    fs.createReadStream(filePath),
    ...(gzip ? [createUnzip(opt.zlibOptions)] : []),
    transformSplit(separator), // splits by separator
    transformJsonParse(opt),
    ...streams,
  ])
}
