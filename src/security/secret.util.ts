import { base64ToString, Debug } from '..'

const log = Debug('nc:nodejs-lib:secret')

export const secretMap: Record<string, string> = init()

/**
 * Make sure to call this function early on server startup, so secrets are removed from process.env
 */
export function loadSecrets (): void {}

/**
 * Loads plaintext secrets from process.env, removes them, stores locally
 */
function init (): Record<string, string> {
  const map = Object.keys(process.env)
    .filter(k => k.toUpperCase().startsWith('SECRET_'))
    .reduce(
      (map, k) => {
        map[k.toUpperCase()] = process.env[k]!
        delete process.env[k]
        return map
      },
      {} as Record<string, string>,
    )

  log(`${Object.keys(map).length} secrets loaded from process.env`)

  return map
}

/**
 * json secrets are always base64'd
 */
export function secret<T = string> (k: string, json = false): T {
  const v = secretMap[k.toUpperCase()]
  if (!v) {
    throw new Error(`process.env.${k.toUpperCase()} not found!`)
  }

  if (json) {
    return JSON.parse(base64ToString(v))
  }

  return v as any
}

export function secretOptional (k: string): string | undefined {
  return secretMap[k.toUpperCase()]
}
