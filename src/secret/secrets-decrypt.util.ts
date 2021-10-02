import * as path from 'path'
import * as fs from 'fs-extra'
import globby = require('globby')
import { dimGrey, yellow } from '../colors'
import { decryptRandomIVBuffer } from '../security/crypto.util'

export interface DecryptCLIOptions {
  dir: string[]
  encKey: string
  algorithm?: string
  del?: boolean
}

/**
 * Decrypts all files in given directory (*.enc), saves decrypted versions without ending `.enc`.
 * Using provided encKey.
 */
export function secretsDecrypt(
  dir: string[],
  encKey: string,
  algorithm?: string,
  del?: boolean,
): void {
  const patterns = dir.map(d => `${d}/**/*.enc`)

  const filenames = globby.sync(patterns)

  filenames.forEach(filename => {
    const enc = fs.readFileSync(filename)
    const plain = decryptRandomIVBuffer(enc, encKey, algorithm)

    const plainFilename = filename.slice(0, filename.length - '.enc'.length)
    fs.writeFileSync(plainFilename, plain)

    if (del) {
      fs.unlinkSync(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(plainFilename)}`)
  })

  console.log(`decrypted ${yellow(filenames.length)} files in ${dimGrey(dir.join(' '))}`)
}
