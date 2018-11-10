import debug from 'debug'
import { IDebugger } from 'debug'
import * as path from 'path'

export function getDebug (filename: string): IDebugger {
  return debug(getDebugNamespaceFromFilename(filename))
}

function getDebugNamespaceFromFilename (filename: string): string {
  // drop last part after dot
  const a = path.basename(filename).split('.')
  a.pop()
  return a.join('.')
}
