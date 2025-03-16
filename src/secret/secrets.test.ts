import fs from 'node:fs'
import { beforeEach, test, vi } from 'vitest'
import { secretDir } from '../test/paths.cnst'
import { TEST_ENC_KEY } from '../test/test.cnst'
import { secretsDecrypt } from './secrets-decrypt.util'
import { secretsEncrypt } from './secrets-encrypt.util'

beforeEach(() => {
  vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
  vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {})
})

const encKeyBuffer = Buffer.from(TEST_ENC_KEY, 'base64')

test('secrets', async () => {
  secretsDecrypt([secretDir], undefined, encKeyBuffer)
  secretsDecrypt([secretDir], undefined, encKeyBuffer, true)

  secretsEncrypt([secretDir], undefined, encKeyBuffer)
  secretsEncrypt([secretDir], undefined, encKeyBuffer, true)
})
