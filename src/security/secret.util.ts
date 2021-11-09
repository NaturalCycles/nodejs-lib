import * as fs from 'fs'
import { StringMap } from '@naturalcycles/js-lib'
import { base64ToString } from '..'
import { decryptRandomIVBuffer } from './crypto.util'

let loaded = false

const secretMap: StringMap = {}

/**
 * Loads plaintext secrets from process.env, removes them, stores locally.
 * Make sure to call this function early on server startup, so secrets are removed from process.env
 *
 * Does NOT delete previous secrets from secretMap.
 */
export function loadSecretsFromEnv(): void {
  require('dotenv').config() // ensure .env is loaded

  const secrets: StringMap = {}
  Object.keys(process.env)
    .filter(k => k.toUpperCase().startsWith('SECRET_'))
    .forEach(k => {
      secrets[k.toUpperCase()] = process.env[k]!
      secretMap[k.toUpperCase()] = process.env[k]!
      delete process.env[k]
    })

  loaded = true
  console.log(
    `${Object.keys(secrets).length} secret(s) loaded from process.env: ${Object.keys(secrets).join(
      ', ',
    )}`,
  )
}

/**
 * Removes process.env.SECRET_*
 */
export function removeSecretsFromEnv(): void {
  Object.keys(process.env)
    .filter(k => k.toUpperCase().startsWith('SECRET_'))
    .forEach(k => delete process.env[k])
}

/**
 * Does NOT delete previous secrets from secretMap.
 *
 * If SECRET_ENCRYPTION_KEY argument is passed - will decrypt the contents of the file first, before parsing it as JSON.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function loadSecretsFromJsonFile(filePath: string, SECRET_ENCRYPTION_KEY?: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`loadSecretsFromPlainJsonFile() cannot load from path: ${filePath}`)
  }

  let secrets: StringMap

  if (SECRET_ENCRYPTION_KEY) {
    const buf = fs.readFileSync(filePath)
    const plain = decryptRandomIVBuffer(buf, SECRET_ENCRYPTION_KEY).toString('utf8')
    secrets = JSON.parse(plain)
  } else {
    secrets = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  Object.entries(secrets).forEach(([k, v]) => (secretMap[k.toUpperCase()] = v))

  loaded = true
  console.log(
    `${Object.keys(secrets).length} secret(s) loaded from ${filePath}: ${Object.keys(secrets)
      .map(s => s.toUpperCase())
      .join(', ')}`,
  )
}

/**
 * json secrets are always base64'd
 */
export function secret<T = string>(k: string, json = false): T {
  const v = secretOptional(k, json)
  if (!v) {
    throw new Error(`secret(${k.toUpperCase()}) not found!`)
  }

  return v as any
}

export function secretOptional<T = string>(k: string, json = false): T | undefined {
  requireLoaded()
  const v = secretMap[k.toUpperCase()]
  return v && json ? JSON.parse(base64ToString(v)) : v
}

export function getSecretMap(): StringMap {
  requireLoaded()
  return secretMap
}

/**
 * REPLACES secretMap with new map.
 */
export function setSecretMap(map: StringMap): void {
  Object.keys(secretMap).forEach(k => delete secretMap[k])
  Object.entries(map).forEach(([k, v]) => (secretMap[k.toUpperCase()] = v))
  console.log(
    `setSecretMap set ${Object.keys(secretMap).length} secret(s): ${Object.keys(map)
      .map(s => s.toUpperCase())
      .join(', ')}`,
  )
}

function requireLoaded(): void {
  if (!loaded) {
    throw new Error(`Secrets were not loaded! Call loadSecrets() before accessing secrets.`)
  }
}
