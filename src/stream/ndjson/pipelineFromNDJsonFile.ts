import * as fs from 'fs-extra'
import { createUnzip, ZlibOptions } from 'zlib'
import { dimWhite, grey, hb, transformTap, _pipeline } from '../..'
import { transformSplit } from '../..'
import { NDJsonStats } from './ndjson.model'
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
): Promise<NDJsonStats> {
  const { filePath, gzip, separator } = opt

  const started = Date.now()
  let rows = 0

  const { size: sizeBytes } = await fs.stat(filePath)

  console.log(`<< ${grey(filePath)} ${dimWhite(hb(sizeBytes))} started...`)

  await _pipeline([
    fs.createReadStream(filePath),
    ...(gzip ? [createUnzip(opt.zlibOptions)] : []),
    transformSplit(separator), // splits by separator
    transformJsonParse(opt),
    transformTap(() => rows++),
    ...streams,
  ])

  const stats = NDJsonStats.create({
    tookMillis: Date.now() - started,
    rows,
    sizeBytes,
  })

  console.log(`<< ${grey(filePath)}\n` + stats.toPretty())

  return stats
}
