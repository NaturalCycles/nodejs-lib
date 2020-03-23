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
    limit,
  } = yargs.options({
    in: {
      type: 'string',
      demandOption: true,
      desc: 'Input ndjson file path',
    },
    out: {
      type: 'string',
      desc: 'Output ndjson file path',
      demandOption: true,
    },
    mapper: {
      type: 'string',
      desc: 'Mapper file path',
      demandOption: true,
    },
    logEvery: {
      type: 'number',
      default: 1000,
    },
    limit: {
      type: 'number',
    },
  }).argv

  await ndjsonMap({
    inputFilePath,
    outputFilePath,
    mapperFilePath,
    logEvery,
    limit,
  })
})
