import * as fs from 'fs-extra'
import { boldWhite } from '../colors'

export interface GenGlobOptions {
  /**
   * @default to `**` (everything, including sub-dirs)
   */
  inputPatterns?: string[]

  /**
   * @default . (cwd)
   */
  baseDir: string

  /**
   * @default . (cwd)
   */
  outputDir: string
}

export function globPrepare(opt: GenGlobOptions): void {
  // Default pattern
  if (!opt.inputPatterns?.length) opt.inputPatterns = ['**']

  // default to cwd
  opt.baseDir ||= '.'
  opt.outputDir ||= '.'

  if (!fs.existsSync(opt.baseDir)) {
    console.log(`kpy: baseDir doesn't exist: ${boldWhite(opt.baseDir)}`)
    return
  }

  fs.ensureDirSync(opt.outputDir)
}
