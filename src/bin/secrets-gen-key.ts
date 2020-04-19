#!/usr/bin/env node

import * as yargs from 'yargs'
import { generateSecretKeyBase64 } from '..'
import { dimGrey } from '../colors'
import { runScript } from '../script'

runScript(async () => {
  const { sizeBytes } = yargs.option('sizeBytes', {
    type: 'number',
    default: 256,
  }).argv

  const key = await generateSecretKeyBase64(sizeBytes)

  console.log(dimGrey('\nSECRET_ENCRYPTION_KEY:\n'))
  console.log(key, '\n')
})
