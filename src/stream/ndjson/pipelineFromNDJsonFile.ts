import { createUnzip, ZlibOptions } from 'zlib'
import { _hb } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import { transformTap, _pipeline, transformSplit } from '../..'
import { dimWhite, grey } from '../../colors'
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

  const { size: sizeBytes } = fs.statSync(filePath)

  console.log(`<< ${grey(filePath)} ${dimWhite(_hb(sizeBytes))} started...`)

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
