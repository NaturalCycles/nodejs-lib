import * as path from 'path'
import * as fs from 'fs-extra'
import globby = require('globby')
import { dimGrey, yellow } from '../colors'
import { encryptRandomIVBuffer } from '../security/crypto.util'

export interface EncryptCLIOptions {
  pattern: string[]
  encKey: string
  algorithm?: string
  del?: boolean
}

/**
 * Encrypts all files in given directory (except *.enc), saves encrypted versions as filename.ext.enc.
 * Using provided encKey.
 */
export function secretsEncrypt(
  pattern: string[],
  encKey: string,
  algorithm?: string,
  del?: boolean,
): void {
  const patterns = [
    ...pattern,
    `!**/*.enc`, // excluding already encoded
  ]
  const filenames = globby.sync(patterns)

  filenames.forEach(filename => {
    const plain = fs.readFileSync(filename)
    const enc = encryptRandomIVBuffer(plain, encKey, algorithm)

    const encFilename = `${filename}.enc`
    fs.writeFileSync(encFilename, enc)

    if (del) {
      fs.unlinkSync(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(`encrypted ${yellow(filenames.length)} files in (${dimGrey(pattern.join(' '))})`)
}
