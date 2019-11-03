import { AppError } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import { createGzip, ZlibOptions } from 'zlib'
import { _pipeline, grey, transformTap } from '../..'
import { NDJsonStats } from './ndjson.model'
import { transformToNDJson, TransformToNDJsonOptions } from './transformToNDJson'

export interface PipelineToNDJsonFileOptions extends TransformToNDJsonOptions {
  filePath: string

  /**
   * @default false
   * If true - will fail if output file already exists.
   */
  protectFromOverwrite?: boolean

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
 * Convenience pipeline to transform stream of objects into a file in NDJSON format.
 *
 * Does fs.ensureFile() before starting, which will create all needed directories and truncate the file if it existed.
 */
export async function pipelineToNDJsonFile(
  streams: (NodeJS.ReadableStream | NodeJS.WritableStream)[],
  opt: PipelineToNDJsonFileOptions,
): Promise<NDJsonStats> {
  const { filePath, gzip, protectFromOverwrite = false } = opt

  if (protectFromOverwrite && (await fs.pathExists(filePath))) {
    throw new AppError(`pipelineToNDJsonFile: output file exists: ${filePath}`)
  }

  const started = Date.now()
  let rows = 0

  await fs.ensureFile(filePath)

  console.log(`>> ${grey(filePath)} started...`)

  await _pipeline([
    ...streams,
    transformTap(() => rows++),
    transformToNDJson(opt),
    ...(gzip ? [createGzip(opt.zlibOptions)] : []), // optional gzip
    fs.createWriteStream(filePath),
  ])

  const { size: sizeBytes } = await fs.stat(filePath)

  const stats = NDJsonStats.create({
    tookMillis: Date.now() - started,
    rows,
    sizeBytes,
  })

  console.log(`>> ${grey(filePath)}\n` + stats.toPretty())

  return stats
}
