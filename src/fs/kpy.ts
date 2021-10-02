import * as path from 'path'
import { _since } from '@naturalcycles/js-lib'
import * as cpFile from 'cp-file'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as moveFile from 'move-file'
import { boldWhite, dimGrey, grey, yellow } from '../colors'

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
          await moveFile(srcFilename, destFilename, { overwrite })
        } else {
          await cpFile(srcFilename, destFilename, { overwrite })
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
        moveFile.sync(srcFilename, destFilename, { overwrite })
      } else {
        cpFile.sync(srcFilename, destFilename, { overwrite })
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

  if (!fs.existsSync(opt.baseDir)) {
    console.log(`kpy: baseDir doesn't exist: ${boldWhite(opt.baseDir)}`)
    return
  }

  fs.ensureDirSync(opt.outputDir)
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
