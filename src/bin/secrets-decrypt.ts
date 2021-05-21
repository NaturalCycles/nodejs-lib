#!/usr/bin/env node

import * as yargs from 'yargs'
import { dimGrey } from '../colors'
import { runScript } from '../script'
import { DecryptCLIOptions, secretsDecrypt } from '../secret/secrets-decrypt.util'

runScript(() => {
  const { dir, encKey, algorithm, del } = getDecryptCLIOptions()

  secretsDecrypt(dir, encKey, algorithm, del)
})

function getDecryptCLIOptions(): DecryptCLIOptions {
  require('dotenv').config()

  let { dir, encKey, encKeyVar, algorithm, del } = yargs.options({
    dir: {
      type: 'array',
      desc: 'Directory with secrets. Can be many',
      // demandOption: true,
      default: './secret',
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
      console.log(`using encKey from env.${dimGrey(encKeyVar)}`)
    } else {
      throw new Error(
        `encKey is required. Can be provided as --encKey or env.SECRET_ENCRYPTION_KEY (see readme.md)`,
      )
    }
  }

  // `as any` because @types/yargs can't handle string[] type properly
  return { dir: dir as any, encKey, algorithm, del }
}
