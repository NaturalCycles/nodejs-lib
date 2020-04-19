import { pMap } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import { encryptRandomIVBuffer } from '..'
import { dimGrey, yellow } from '../colors'

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
export async function secretsEncrypt(
  pattern: string[],
  encKey: string,
  algorithm?: string,
  del?: boolean,
): Promise<void> {
  const patterns = [
    ...pattern,
    `!**/*.enc`, // excluding already encoded
  ]
  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const plain = await fs.readFile(filename)
    const enc = await encryptRandomIVBuffer(plain, encKey, algorithm)

    const encFilename = `${filename}.enc`
    await fs.writeFile(encFilename, enc)

    if (del) {
      await fs.unlink(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(`encrypted ${yellow(filenames.length)} files in (${dimGrey(pattern.join(' '))})`)
}
