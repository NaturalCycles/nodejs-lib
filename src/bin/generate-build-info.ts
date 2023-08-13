#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yargs from 'yargs'
import { appendToBashEnv, appendToGithubEnv, appendToGithubOutput } from '../fs/json2env'
import { runScript } from '../script/runScript'
import { generateBuildInfo } from '../util/buildInfo.util'

runScript(async () => {
  const { dir, overrideTimestamp } = yargs.options({
    dir: {
      type: 'string',
      desc: 'Output directory',
    },
    overrideTimestamp: {
      type: 'number',
      desc: 'This unix timestamp will be used instead of "current time"',
    },
  }).argv

  const buildInfo = generateBuildInfo({
    overrideTimestamp,
  })
  console.log(buildInfo)

  if (dir) fs.mkdirSync(dir, { recursive: true })

  const buildInfoPath = dir ? path.resolve(dir, 'buildInfo.json') : 'buildInfo.json'
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2))

  const prefix = 'buildInfo_'

  appendToBashEnv(buildInfo, prefix)
  appendToGithubEnv(buildInfo, prefix)
  appendToGithubOutput(buildInfo, prefix)
})
