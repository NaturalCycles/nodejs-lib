#!/usr/bin/env node

import * as yargs from 'yargs'
import { dimGrey } from '../colors'
import { runScript } from '../script'
import { EncryptCLIOptions, secretsEncrypt } from '../secret/secrets-encrypt.util'

runScript(() => {
  const { pattern, encKey, algorithm, del } = getEncryptCLIOptions()

  secretsEncrypt(pattern, encKey, algorithm, del)
})

function getEncryptCLIOptions(): EncryptCLIOptions {
  require('dotenv').config()

  let { pattern, encKey, encKeyVar, algorithm, del } = yargs.options({
    pattern: {
      type: 'string',
      array: true,
      desc: 'Globby pattern for secrets. Can be many.',
      // demandOption: true,
      default: './secret/**',
    },
    encKey: {
      type: 'string',
      desc: 'Encryption key',
      // demandOption: true,
      // default: process.env.SECRET_ENCRYPTION_KEY!,
    },
    encKeyVar: {
      type: 'string',
      desc: 'Env variable name to get `encKey` from.',
      default: 'SECRET_ENCRYPTION_KEY',
    },
    algorithm: {
      type: 'string',
      default: 'aes-256-cbc',
    },
    del: {
      type: 'boolean',
      desc: 'Delete source files after encryption/decryption. Be careful!',
    },
  }).argv

  if (!encKey) {
    encKey = process.env[encKeyVar]

    if (encKey) {
      console.log(`using encKey from process.env.${dimGrey(encKeyVar)}`)
    } else {
      throw new Error(
        `encKey is required. Can be provided as --encKey or env.SECRET_ENCRYPTION_KEY (see readme.md)`,
      )
    }
  }

  // `as any` because @types/yargs can't handle string[] type properly
  return { pattern: pattern as any, encKey, algorithm, del }
}
