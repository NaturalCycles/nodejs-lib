import * as fs from 'node:fs'
import { createUnzip } from 'node:zlib'
import { AbortableAsyncMapper, ErrorMode } from '@naturalcycles/js-lib'
import {
  requireFileToExist,
  transformJsonParse,
  transformLogProgress,
  TransformLogProgressOptions,
  transformMap,
  TransformMapOptions,
  transformSplit,
  writableVoid,
  _pipeline,
} from '../..'

export interface NDJSONStreamForEachOptions<IN = any>
  extends TransformMapOptions<IN, void>,
    TransformLogProgressOptions<IN> {
  inputFilePath: string
}

/**
 * Convenience function to `forEach` through an ndjson file.
 */
export async function ndjsonStreamForEach<T>(
  mapper: AbortableAsyncMapper<T, void>,
  opt: NDJSONStreamForEachOptions<T>,
): Promise<void> {
  requireFileToExist(opt.inputFilePath)

  const transformUnzip = opt.inputFilePath.endsWith('.gz') ? [createUnzip()] : []

  await _pipeline([
    fs.createReadStream(opt.inputFilePath),
    ...transformUnzip,
    transformSplit(),
    transformJsonParse(),
    transformMap<T, any>(mapper, {
      errorMode: ErrorMode.THROW_AGGREGATED,
      ...opt,
      predicate: () => true, // to log progress properly
    }),
    transformLogProgress(opt),
    writableVoid(),
  ])
}
