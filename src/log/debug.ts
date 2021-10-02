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
  debug: (...args: any[]) => void
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
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

const originalDebug = require('debug') as IDebug

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Debug = ((namespace: string) => {
  const instance = originalDebug(namespace)
  instance.log = console.log.bind(console) // this enables colors for objects
  instance.info = instance.bind(instance)

  const instanceDebug = originalDebug([namespace, 'debug'].join(':'))
  instanceDebug.log = console.debug.bind(console)
  instance.debug = instanceDebug.bind(instanceDebug)

  const instanceWarn = originalDebug([namespace, 'warn'].join(':'))
  instanceWarn.log = console.warn.bind(console)
  instance.warn = instanceWarn.bind(instanceWarn)

  const instanceError = originalDebug([namespace, 'error'].join(':'))
  instanceError.log = console.error.bind(console)
  instance.error = instanceError.bind(instanceError)

  return instance
}) as IDebug
Debug.coerce = originalDebug.coerce.bind(originalDebug)
Debug.disable = originalDebug.disable.bind(originalDebug)
Debug.enable = originalDebug.enable.bind(originalDebug)
Debug.enabled = originalDebug.enabled.bind(originalDebug)
Debug.log = originalDebug.log.bind(originalDebug)
Debug.names = originalDebug.names
Debug.skips = originalDebug.skips
Debug.formatters = originalDebug.formatters
