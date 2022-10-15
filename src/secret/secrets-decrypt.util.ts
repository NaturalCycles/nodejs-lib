import * as path from 'node:path'
import { _assert } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import { dimGrey, yellow } from '../colors'
import { fastGlob } from '../index'
import { decryptObject, decryptRandomIVBuffer } from '../security/crypto.util'

export interface DecryptCLIOptions {
  dir: string[]
  file?: string
  encKey: string
  del?: boolean
  jsonMode?: boolean
}

// Debug it like this:
// yarn tsn ./src/bin/secrets-decrypt.ts --file ./src/test/secrets2.json --jsonMode --encKey MPd/30v0Zcce4I5mfwF4NSXrpTYD9OO4/fIqw6rjNiWp2b1GN9Xm8nQZqr7c9kKSsATqtwe0HkJFDUGzDSow44GDgDICgB1u1rGa5eNqtxnOVGRR+lIinCvN/1OnpjzeoJy2bStXPj1DKx8anMqgA8SoOZdlWRNSkEeZlolru8Ey0ujZo22dfwMyRIEniLcqvBm/iMiAkV82fn/TxYw05GarAoJcrfPeDBvuOXsARnMCyX18qTFL0iojxeTU8JHxr8TX3eXDq9cJJmridEKlwRIAzADwtetI4ttlP8lwJj1pmgsBIN3iqYssZYCkZ3HMV6BoEc7LTI5z/45rKrAT1A==
// yarn tsn ./src/bin/secrets-encrypt.ts --file ./src/test/secrets2.plain.json --jsonMode --encKey MPd/30v0Zcce4I5mfwF4NSXrpTYD9OO4/fIqw6rjNiWp2b1GN9Xm8nQZqr7c9kKSsATqtwe0HkJFDUGzDSow44GDgDICgB1u1rGa5eNqtxnOVGRR+lIinCvN/1OnpjzeoJy2bStXPj1DKx8anMqgA8SoOZdlWRNSkEeZlolru8Ey0ujZo22dfwMyRIEniLcqvBm/iMiAkV82fn/TxYw05GarAoJcrfPeDBvuOXsARnMCyX18qTFL0iojxeTU8JHxr8TX3eXDq9cJJmridEKlwRIAzADwtetI4ttlP8lwJj1pmgsBIN3iqYssZYCkZ3HMV6BoEc7LTI5z/45rKrAT1A==

/**
 * Decrypts all files in given directory (*.enc), saves decrypted versions without ending `.enc`.
 * Using provided encKey.
 */
export function secretsDecrypt(
  dir: string[],
  file: string | undefined,
  encKey: string,
  del = false,
  jsonMode = false,
): void {
  // If `file` is provided - only this one file is used
  const patterns = file ? [file] : dir.map(d => `${d}/**/*.enc`)

  const filenames = fastGlob.sync(patterns)

  filenames.forEach(filename => {
    let plainFilename

    if (jsonMode) {
      _assert(filename.endsWith('.json'), `${path.basename(filename)} MUST end with '.json'`)
      _assert(
        !filename.endsWith('.plain.json'),
        `${path.basename(filename)} MUST NOT end with '.plain.json'`,
      )
      plainFilename = filename.replace('.json', '.plain.json')

      const json = decryptObject(JSON.parse(fs.readFileSync(filename, 'utf8')), encKey)

      fs.writeFileSync(plainFilename, JSON.stringify(json, null, 2))
    } else {
      const enc = fs.readFileSync(filename)
      const plain = decryptRandomIVBuffer(enc, encKey)
      plainFilename = filename.slice(0, filename.length - '.enc'.length)
      fs.writeFileSync(plainFilename, plain)
    }

    if (del) {
      fs.unlinkSync(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(plainFilename)}`)
  })

  console.log(`decrypted ${yellow(filenames.length)} files in ${dimGrey(dir.join(' '))}`)
}
