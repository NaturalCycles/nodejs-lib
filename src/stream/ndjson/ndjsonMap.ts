import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip, createUnzip } from 'node:zlib'
import { AbortableAsyncMapper, ErrorMode } from '@naturalcycles/js-lib'
import {
  requireFileToExist,
  transformJsonParse,
  transformLimit,
  transformLogProgress,
  transformMap,
  TransformMapOptions,
  transformSplit,
  transformToNDJson,
  _pipeline,
  TransformLogProgressOptions,
} from '../..'

export interface NDJSONMapOptions<IN = any, OUT = IN>
  extends TransformMapOptions<IN, OUT>,
    TransformLogProgressOptions<IN> {
  inputFilePath: string
  outputFilePath: string

  limitInput?: number
  limitOutput?: number

  /**
   * @default 100_000
   */
  logEveryOutput?: number

  /**
   * Defaults to `true` for ndjsonMap
   *
   * @default true
   */
  flattenArrayOutput?: boolean
}

/**
 * Unzips input file automatically, if it ends with `.gz`.
 * Zips output file automatically, if it ends with `.gz`.
 */
export async function ndjsonMap<IN = any, OUT = any>(
  mapper: AbortableAsyncMapper<IN, OUT>,
  opt: NDJSONMapOptions<IN, OUT>,
): Promise<void> {
  const { inputFilePath, outputFilePath, logEveryOutput = 100_000, limitInput, limitOutput } = opt

  requireFileToExist(inputFilePath)

  console.log({
    inputFilePath,
    outputFilePath,
  })

  const transformUnzip = inputFilePath.endsWith('.gz') ? [createUnzip()] : []
  const transformZip = outputFilePath.endsWith('.gz') ? [createGzip()] : []

  const readable = createReadStream(inputFilePath)

  await _pipeline([
    readable,
    ...transformUnzip,
    transformSplit(), // splits by \n
    transformJsonParse(),
    transformLimit({ limit: limitInput, sourceReadable: readable }),
    transformLogProgress({ metric: 'read', ...opt }),
    transformMap(mapper, {
      flattenArrayOutput: true,
      errorMode: ErrorMode.SUPPRESS,
      ...opt,
    }),
    transformLimit({ limit: limitOutput, sourceReadable: readable }),
    transformLogProgress({ metric: 'saved', logEvery: logEveryOutput }),
    transformToNDJson(),
    ...transformZip,
    createWriteStream(outputFilePath),
  ])
}
