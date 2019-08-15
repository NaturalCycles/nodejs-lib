// Types based on @types/debug
export interface IDebug {
  (namespace: string): IDebugger
  coerce: (val: any) => any
  disable: () => string
  enable: (namespaces: string) => void
  enabled: (namespaces: string) => boolean
  log: (...args: any[]) => any

  names: RegExp[]
  skips: RegExp[]

  formatters: DebugFormatters
}

export interface DebugFormatters {
  [formatter: string]: (v: any) => string
}

export interface IDebugger {
  // (formatter: any, ...args: any[]): void;
  (...args: any[]): void
  info: (...args: any[]) => void // alias to just log()
  warn: (...args: any[]) => void
  error: (...args: any[]) => void

  color: string
  enabled: boolean
  log: (...args: any[]) => any
  namespace: string
  destroy: () => boolean
  // extend: (namespace: string, delimiter?: string) => IDebugger
}

export enum DebugLogLevel {
  info = 'info',
  warn = 'warn',
  error = 'error',
}

const OriginalDebug = require('debug') as IDebug
// This enables colors for objects:
OriginalDebug.log = console.log.bind(console)

export const Debug = ((namespace: string) => {
  const instance = OriginalDebug(namespace)
  instance.info = instance.bind(instance)

  const instanceWarn = OriginalDebug([namespace, 'warn'].join(':'))
  instanceWarn.log = console.warn.bind(console)
  instance.warn = instanceWarn.bind(instanceWarn)

  const instanceError = OriginalDebug([namespace, 'error'].join(':'))
  instanceError.log = console.error.bind(console)
  instance.error = instanceError.bind(instanceError)

  return instance
}) as IDebug
Debug.coerce = OriginalDebug.coerce.bind(OriginalDebug)
Debug.disable = OriginalDebug.disable.bind(OriginalDebug)
Debug.enable = OriginalDebug.enable.bind(OriginalDebug)
Debug.enabled = OriginalDebug.enabled.bind(OriginalDebug)
Debug.log = OriginalDebug.log.bind(OriginalDebug)
Debug.names = OriginalDebug.names
Debug.skips = OriginalDebug.skips
Debug.formatters = OriginalDebug.formatters
