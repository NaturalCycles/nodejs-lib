#!/usr/bin/env node

import * as crypto from 'crypto'
import * as yargs from 'yargs'
import { dimGrey } from '../colors'
import { runScript } from '../script'

runScript(() => {
  const { sizeBytes } = yargs.option('sizeBytes', {
    type: 'number',
    default: 256,
  }).argv

  const key = crypto.randomBytes(sizeBytes).toString('base64')

  console.log(dimGrey('\nSECRET_ENCRYPTION_KEY:\n'))
  console.log(key, '\n')
})
