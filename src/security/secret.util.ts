import * as fs from 'fs-extra'
import { base64ToString, Debug, decryptRandomIVBuffer } from '..'

let loaded = false
const log = Debug('nc:nodejs-lib:secret')

const secretMap: Record<string, string> = {}

/**
 * Loads plaintext secrets from process.env, removes them, stores locally.
 * Make sure to call this function early on server startup, so secrets are removed from process.env
 *
 * Does NOT delete previous secrets from secretMap.
 */
export function loadSecretsFromEnv (): void {
  require('dotenv').config() // ensure .env is loaded

  const secrets: Record<string, string> = {}
  Object.keys(process.env)
    .filter(k => k.toUpperCase().startsWith('SECRET_'))
    .forEach(k => {
      secrets[k.toUpperCase()] = process.env[k]!
      secretMap[k.toUpperCase()] = process.env[k]!
      delete process.env[k]
    })

  loaded = true
  log(
    `${Object.keys(secrets).length} secret(s) loaded from process.env: ${Object.keys(secrets).join(
      ', ',
    )}`,
  )
}

/**
 * Removes process.env.SECRET_*
 */
export function removeSecretsFromEnv (): void {
  Object.keys(process.env)
    .filter(k => k.toUpperCase().startsWith('SECRET_'))
    .forEach(k => delete process.env[k])
}

/**
 * Does NOT delete previous secrets from secretMap.
 *
 * If SECRET_ENCRYPTION_KEY argument is passed - will decrypt the contents of the file first, before parsing it as JSON.
 */
export function loadSecretsFromJsonFile (filePath: string, SECRET_ENCRYPTION_KEY?: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`loadSecretsFromPlainJsonFile() cannot load from path: ${filePath}`)
  }

  let secrets: Record<string, string>

  if (SECRET_ENCRYPTION_KEY) {
    const buf = fs.readFileSync(filePath)
    const plain = decryptRandomIVBuffer(buf, SECRET_ENCRYPTION_KEY).toString('utf8')
    secrets = JSON.parse(plain)
  } else {
    secrets = fs.readJsonSync(filePath)
  }

  Object.entries(secrets).forEach(([k, v]) => (secretMap[k.toUpperCase()] = v))

  loaded = true
  log(
    `${Object.keys(secrets).length} secret(s) loaded from ${filePath}: ${Object.keys(secrets)
      .map(s => s.toUpperCase())
      .join(', ')}`,
  )
}

/**
 * json secrets are always base64'd
 */
export function secret<T = string> (k: string, json = false): T {
  const v = secretOptional(k)
  if (!v) {
    throw new Error(`secret(${k.toUpperCase()}) not found!`)
  }

  if (json) {
    return JSON.parse(base64ToString(v))
  }

  return v as any
}

export function secretOptional (k: string): string | undefined {
  requireLoaded()
  return secretMap[k.toUpperCase()]
}

export function getSecretMap (): Record<string, string> {
  requireLoaded()
  return secretMap
}

/**
 * REPLACES secretMap with new map.
 */
export function setSecretMap (map: Record<string, string>): void {
  Object.keys(secretMap).forEach(k => delete secretMap[k])
  Object.entries(map).forEach(([k, v]) => (secretMap[k.toUpperCase()] = v))
  log(
    `setSecretMap set ${Object.keys(secretMap).length} secret(s): ${Object.keys(map)
      .map(s => s.toUpperCase())
      .join(', ')}`,
  )
}

function requireLoaded (): void {
  if (!loaded) {
    throw new Error(`Secrets were not loaded! Call loadSecrets() before accessing secrets.`)
  }
}
