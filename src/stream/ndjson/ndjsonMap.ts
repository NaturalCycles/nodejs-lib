import { AsyncMapper } from '@naturalcycles/js-lib'
import { createReadStream, createWriteStream } from 'fs'
import * as path from 'path'
import { createGzip, createUnzip } from 'zlib'
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
} from '../..'

interface NDJSONMapperFile<IN = any, OUT = any> {
  mapper: AsyncMapper<IN, OUT>
}

export interface NDJSONMapOptions<IN = any, OUT = IN> extends TransformMapOptions<IN, OUT> {
  inputFilePath: string
  outputFilePath: string
  mapperFilePath: string
  limitInput?: number
  limitOutput?: number

  /**
   * @default 100
   */
  logEveryInput?: number

  /**
   * @default 0 (disabled)
   */
  logEveryOutput?: number
}

/**
 * Unzips input file automatically, if it ends with `.gz`.
 * Zips output file automatically, if it ends with `.gz`.
 */
export async function ndjsonMap<IN = any, OUT = any>(
  opt: NDJSONMapOptions<IN, OUT>,
): Promise<void> {
  const {
    inputFilePath,
    outputFilePath,
    mapperFilePath,
    logEveryInput,
    logEveryOutput = 0,
    limitInput,
    limitOutput,
  } = opt

  requireFileToExist(inputFilePath)
  requireFileToExist(mapperFilePath)

  const resolvedMapperPath = path.resolve(mapperFilePath)

  console.log({
    inputFilePath,
    outputFilePath,
    mapperFilePath,
    resolvedMapperPath,
  })

  // This is to allow importing *.ts mappers
  try {
    require('ts-node/register/transpile-only')
    require('tsconfig-paths/register')
  } catch {} // require if exists

  const { mapper } = require(resolvedMapperPath) as NDJSONMapperFile<IN, OUT>

  if (!mapper) {
    throw new Error(`Mapper file should export "mapper" function`)
  }

  const transformUnzip = inputFilePath.endsWith('.gz') ? [createUnzip()] : []
  const transformZip = outputFilePath.endsWith('.gz') ? [createGzip()] : []

  await _pipeline([
    createReadStream(inputFilePath),
    ...transformUnzip,
    transformSplit(), // splits by \n
    transformJsonParse(),
    transformLimit(limitInput),
    transformLogProgress({ metric: 'read', logEvery: logEveryInput }),
    transformMap(mapper, {
      flattenArrayOutput: true,
      ...opt,
    }),
    transformLimit(limitOutput),
    transformLogProgress({ metric: 'saved', logEvery: logEveryOutput }),
    transformToNDJson(),
    ...transformZip,
    createWriteStream(outputFilePath),
  ])
}
