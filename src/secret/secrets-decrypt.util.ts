import { pMap } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import { decryptRandomIVBuffer } from '..'
import { dimGrey, yellow } from '../colors'

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
export async function secretsDecrypt(
  dir: string[],
  encKey: string,
  algorithm?: string,
  del?: boolean,
): Promise<void> {
  const patterns = dir.map(d => `${d}/**/*.enc`)

  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const enc = await fs.readFile(filename)
    const plain = decryptRandomIVBuffer(enc, encKey, algorithm)

    const plainFilename = filename.substr(0, filename.length - '.enc'.length)
    await fs.writeFile(plainFilename, plain)

    if (del) {
      await fs.unlink(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(plainFilename)}`)
  })

  console.log(`decrypted ${yellow(filenames.length)} files in ${dimGrey(dir.join(' '))}`)
}
