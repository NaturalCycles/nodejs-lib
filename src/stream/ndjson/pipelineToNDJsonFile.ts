import { createGzip, ZlibOptions } from 'node:zlib'
import * as fs from 'node:fs'
import { AppError } from '@naturalcycles/js-lib'
import { transformTap, _pipeline, _pathExistsSync, _ensureFileSync } from '../..'
import { grey } from '../../colors/colors'
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

  if (protectFromOverwrite && _pathExistsSync(filePath)) {
    throw new AppError(`pipelineToNDJsonFile: output file exists: ${filePath}`)
  }

  const started = Date.now()
  let rows = 0

  _ensureFileSync(filePath)

  console.log(`>> ${grey(filePath)} started...`)

  await _pipeline([
    ...streams,
    transformTap(() => rows++),
    transformToNDJson(opt),
    ...(gzip ? [createGzip(opt.zlibOptions)] : []), // optional gzip
    fs.createWriteStream(filePath),
  ])

  const { size: sizeBytes } = fs.statSync(filePath)

  const stats = NDJsonStats.create({
    tookMillis: Date.now() - started,
    rows,
    sizeBytes,
  })

  console.log(`>> ${grey(filePath)}\n` + stats.toPretty())

  return stats
}
