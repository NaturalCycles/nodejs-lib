import * as path from 'path'
import { _assert, _stringMapEntries, StringMap } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import globby = require('globby')
import { dimGrey, yellow } from '../colors'
import { encryptRandomIVBuffer, encryptString } from '../security/crypto.util'

export interface EncryptCLIOptions {
  pattern: string[]
  file?: string
  encKey: string
  del?: boolean
  jsonMode?: boolean
}

/**
 * Encrypts all files in given directory (except *.enc), saves encrypted versions as filename.ext.enc.
 * Using provided encKey.
 */
export function secretsEncrypt(
  pattern: string[],
  file: string | undefined,
  encKey: string,
  del = false,
  jsonMode = false,
): void {
  const patterns = file
    ? [file]
    : [
        ...pattern,
        `!**/*.enc`, // excluding already encoded
      ]
  const filenames = globby.sync(patterns)
  let encFilename

  filenames.forEach(filename => {
    if (jsonMode) {
      _assert(
        filename.endsWith('.plain.json'),
        `${path.basename(filename)} MUST end with '.plain.json'`,
      )
      encFilename = filename.replace('.plain', '')

      const json: StringMap = JSON.parse(fs.readFileSync(filename, 'utf8'))

      _stringMapEntries(json).forEach(([k, plain]) => {
        json[k] = encryptString(plain, encKey)
      })

      fs.writeFileSync(encFilename, JSON.stringify(json, null, 2))
    } else {
      const plain = fs.readFileSync(filename)
      const enc = encryptRandomIVBuffer(plain, encKey)
      encFilename = `${filename}.enc`
      fs.writeFileSync(encFilename, enc)
    }

    if (del) {
      fs.unlinkSync(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(`encrypted ${yellow(filenames.length)} files in (${dimGrey(pattern.join(' '))})`)
}
