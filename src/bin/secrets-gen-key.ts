#!/usr/bin/env node

import { randomBytes } from 'node:crypto'
import yargs from 'yargs'
import { dimGrey } from '../colors/colors.js'
import { runScript } from '../script/runScript.js'

runScript(() => {
  const { sizeBytes } = yargs.option('sizeBytes', {
    type: 'number',
    default: 256,
  }).argv

  const key = randomBytes(sizeBytes).toString('base64')

  console.log(dimGrey('\nSECRET_ENCRYPTION_KEY:\n'))
  console.log(key, '\n')
})
