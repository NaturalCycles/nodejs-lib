import { base64ToString, Debug } from '..'

let loaded = false
const log = Debug('nc:nodejs-lib:secret')

const secretMap: Record<string, string> = {}

/**
 * Loads plaintext secrets from process.env, removes them, stores locally.
 * Make sure to call this function early on server startup, so secrets are removed from process.env
 */
export function loadSecrets (): void {
  if (loaded) return

  Object.keys(process.env)
    .filter(k => k.toUpperCase().startsWith('SECRET_'))
    .forEach(k => {
      secretMap[k.toUpperCase()] = process.env[k]!
      delete process.env[k]
    })

  loaded = true
  log(`${Object.keys(secretMap).length} secrets loaded from process.env`)
}

/**
 * json secrets are always base64'd
 */
export function secret<T = string> (k: string, json = false): T {
  const v = secretOptional(k)
  if (!v) {
    throw new Error(`process.env.${k.toUpperCase()} not found!`)
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

function requireLoaded (): void {
  if (!loaded) {
    throw new Error(`Secrets were not loaded! Call loadSecrets() before accessing secrets.`)
  }
}
