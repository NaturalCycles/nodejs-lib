import { Mapper } from '@naturalcycles/js-lib'
import { createReadStream, createWriteStream } from 'fs'
import * as path from 'path'
import { createGzip, createUnzip } from 'zlib'
import {
  requireFileToExist,
  transformJsonParse,
  transformLogProgress,
  TransformLogProgressOptions,
  transformMap,
  TransformMapOptions,
  transformSplit,
  transformToNDJson,
  _pipeline,
} from '../..'

interface NDJSONMapperFile<IN = any, OUT = any> {
  mapper: Mapper<IN, OUT>
}

export interface NDJSONMapOptions<OUT = any>
  extends TransformMapOptions<OUT>,
    TransformLogProgressOptions {
  inputFilePath: string
  outputFilePath: string
  mapperFilePath: string
}

/**
 * Unzips input file automatically, if it ends with `.gz`.
 * Zips output file automatically, if it ends with `.gz`.
 */
export async function ndjsonMap<IN = any, OUT = any>(opt: NDJSONMapOptions<OUT>): Promise<void> {
  const { inputFilePath, outputFilePath, mapperFilePath } = opt

  await requireFileToExist(inputFilePath)
  await requireFileToExist(mapperFilePath)

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
    transformMap(mapper, {
      flattenArrayOutput: true,
      ...opt,
    }),
    transformLogProgress({ logEvery: 1000 }),
    transformToNDJson(),
    ...transformZip,
    createWriteStream(outputFilePath),
  ])
}
