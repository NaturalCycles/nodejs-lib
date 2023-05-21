import * as path from 'node:path'
import { _since } from '@naturalcycles/js-lib'
import { boldWhite, dimGrey, grey, yellow } from '../colors'
import {
  _copyPath,
  _copyPathSync,
  _ensureDirSync,
  _movePath,
  _movePathSync,
  _pathExistsSync,
  globby,
} from '../index'

/**
 * Everything defaults to `undefined`.
 */
export interface KpyOptions {
  /**
   * @default . (cwd)
   */
  baseDir: string

  /**
   * @default to `**` (everything, including sub-dirs)
   */
  inputPatterns?: string[]

  /**
   * @default . (cwd)
   */
  outputDir: string

  silent?: boolean
  verbose?: boolean

  /**
   * Safety setting
   *
   * @default false
   */
  noOverwrite?: boolean

  dotfiles?: boolean
  flat?: boolean
  dry?: boolean

  /**
   * Will Move instead of Copy
   */
  move?: boolean
}

export async function kpy(opt: KpyOptions): Promise<void> {
  const started = Date.now()

  kpyPrepare(opt)

  const filenames = await globby(opt.inputPatterns!, {
    cwd: opt.baseDir,
    dot: opt.dotfiles,
  })

  kpyLogFilenames(opt, filenames)

  const overwrite = !opt.noOverwrite

  await Promise.all(
    filenames.map(async filename => {
      const basename = path.basename(filename)
      const srcFilename = path.resolve(opt.baseDir, filename)
      const destFilename = path.resolve(opt.outputDir, opt.flat ? basename : filename)

      if (!opt.dry) {
        if (opt.move) {
          await _movePath(srcFilename, destFilename, { overwrite })
        } else {
          await _copyPath(srcFilename, destFilename, { overwrite })
        }
      }

      if (opt.verbose) {
        console.log(grey(`  ${filename}`))
      }
    }),
  )

  kpyLogResult(opt, filenames, started)
}

export function kpySync(opt: KpyOptions): void {
  const started = Date.now()

  kpyPrepare(opt)

  const filenames = globby.sync(opt.inputPatterns!, {
    cwd: opt.baseDir,
    dot: opt.dotfiles,
  })

  kpyLogFilenames(opt, filenames)

  const overwrite = !opt.noOverwrite

  filenames.forEach(filename => {
    const basename = path.basename(filename)
    const srcFilename = path.resolve(opt.baseDir, filename)
    const destFilename = path.resolve(opt.outputDir, opt.flat ? basename : filename)

    if (!opt.dry) {
      if (opt.move) {
        _movePathSync(srcFilename, destFilename, { overwrite })
      } else {
        _copyPathSync(srcFilename, destFilename, { overwrite })
      }
    }

    if (opt.verbose) {
      console.log(grey(`  ${filename}`))
    }
  })

  kpyLogResult(opt, filenames, started)
}

function kpyPrepare(opt: KpyOptions): void {
  // Default pattern
  if (!opt.inputPatterns?.length) opt.inputPatterns = ['**']

  // default to cwd
  opt.baseDir ||= '.'
  opt.outputDir ||= '.'

  if (!_pathExistsSync(opt.baseDir)) {
    console.log(`kpy: baseDir doesn't exist: ${boldWhite(opt.baseDir)}`)
    return
  }

  _ensureDirSync(opt.outputDir)
}

function kpyLogFilenames(opt: KpyOptions, filenames: string[]): void {
  if (opt.silent) return

  // console.log({filenames})
  console.log(
    `Will ${opt.move ? 'move' : 'copy'} ${yellow(filenames.length)} files from ${dimGrey(
      opt.baseDir,
    )} to ${dimGrey(opt.outputDir)} (${dimGrey(opt.inputPatterns!.join(' '))})`,
  )
}

function kpyLogResult(opt: KpyOptions, filenames: string[], started: number): void {
  if (opt.silent || filenames.length === 0) return

  console.log(
    `${opt.move ? 'Moved' : 'Copied'} ${yellow(filenames.length)} files to ${dimGrey(
      opt.outputDir,
    )} ${dimGrey(_since(started))}`,
  )
}
