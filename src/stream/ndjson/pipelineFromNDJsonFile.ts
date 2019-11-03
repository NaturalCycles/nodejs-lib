import { since } from '@naturalcycles/time-lib'
import * as fs from 'fs-extra'
import { createUnzip, ZlibOptions } from 'zlib'
import { _pipeline, dimWhite, hb, transformTap } from '../..'
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

  const started = Date.now()
  let count = 0

  const { size } = await fs.stat(filePath)

  console.log([`pipelineFromNDJsonFile started`, `${filePath}: ${dimWhite(hb(size))}`].join('\n'))

  await _pipeline([
    fs.createReadStream(filePath),
    ...(gzip ? [createUnzip(opt.zlibOptions)] : []),
    transformSplit(separator), // splits by separator
    transformJsonParse(opt),
    transformTap(() => count++),
    ...streams,
  ])

  const tookMillis = Date.now() - started || 1 // cast 0 to 1 to avoid NaN
  const rpsTotal = Math.round(count / (tookMillis / 1000))
  const bpsTotal = size === 0 ? 0 : Math.round(size / (tookMillis / 1000))

  console.log(
    [
      `pipelineFromNDJsonFile finished reading ${dimWhite(count)} rows in ${dimWhite(
        since(started),
      )}, avg ${dimWhite(rpsTotal + ' rows/sec')}`,
      `${filePath}: ${dimWhite(hb(size))}, avg ${dimWhite(hb(size / count) + '/row')}, ${dimWhite(
        hb(bpsTotal) + '/sec',
      )}`,
    ].join('\n'),
  )
}
