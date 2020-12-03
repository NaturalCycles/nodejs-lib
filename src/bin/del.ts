#!/usr/bin/env node

import * as yargs from 'yargs'
import { del } from '../fs/del'
import { runScript } from '../script'

runScript(async () => {
  const { _: patterns, ...opt } = yargs.demandCommand(1).options({
    verbose: {
      type: 'boolean',
    },
    silent: {
      type: 'boolean',
    },
    debug: {
      type: 'boolean',
    },
    dry: {
      type: 'boolean',
    },
    concurrency: {
      type: 'number',
    },
  }).argv

  await del({ patterns: patterns as string[], ...opt })
})
