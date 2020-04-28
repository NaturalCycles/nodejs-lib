#!/usr/bin/env node

import * as yargs from 'yargs'
import { runScript } from '../script'
import { ndjsonMap } from '../stream/ndjson/ndjsonMap'

runScript(async () => {
  const {
    in: inputFilePath,
    out: outputFilePath,
    mapper: mapperFilePath,
    logEveryInput,
    logEveryOutput,
    limitInput,
    limitOutput,
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
    logEveryInput: {
      type: 'number',
      default: 1000,
    },
    logEveryOutput: {
      type: 'number',
      default: 0,
    },
    limitInput: {
      type: 'number',
    },
    limitOutput: {
      type: 'number',
    },
  }).argv

  await ndjsonMap({
    inputFilePath,
    outputFilePath,
    mapperFilePath,
    logEveryInput,
    logEveryOutput,
    limitInput,
    limitOutput,
  })
})
