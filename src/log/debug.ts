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

  color: string
  enabled: boolean
  log: (...args: any[]) => any
  namespace: string
  destroy: () => boolean
  extend: (namespace: string, delimiter?: string) => IDebugger
}

export const Debug = require('debug') as IDebug

// This inables colors for objects:
Debug.log = console.log.bind(console)
