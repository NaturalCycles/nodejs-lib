#!/usr/bin/env node

import * as yargs from 'yargs'
import { runScript } from '..'
import { ndjsonMap } from '../stream/ndjson/ndjsonMap'

runScript(async () => {
  const {
    in: inputFilePath,
    out: outputFilePath,
    mapper: mapperFilePath,
    logEvery,
  } = yargs.options({
    in: {
      type: 'string',
      demandOption: true,
      descr: 'Input ndjson file path',
    },
    out: {
      type: 'string',
      descr: 'Output ndjson file path',
      demandOption: true,
    },
    mapper: {
      type: 'string',
      descr: 'Mapper file path',
      demandOption: true,
    },
    logEvery: {
      type: 'number',
      default: 1000,
    },
  }).argv

  await ndjsonMap({
    inputFilePath,
    outputFilePath,
    mapperFilePath,
    logEvery,
  })
})
