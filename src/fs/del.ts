import { pFilter, pMap, _since } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import { dimGrey, yellow } from '../colors'

export interface DelOptions {
  /**
   * Globby patterns.
   */
  patterns: string[]

  /**
   * @default 0 (infinite)
   */
  concurrency?: number

  verbose?: boolean

  silent?: boolean

  debug?: boolean

  dry?: boolean
}

export type DelSingleOption = string

const DEF_OPT: DelOptions = {
  patterns: [],
  concurrency: Number.POSITIVE_INFINITY,
}

/**
 * Delete files that match input patterns.
 *
 * @experimental
 */
export async function del(_opt: DelOptions | DelSingleOption): Promise<void> {
  const started = Date.now()

  // Convert DelSingleOption to DelOptions
  if (typeof _opt === 'string') {
    _opt = {
      patterns: [_opt],
    }
  }

  const opt = {
    ...DEF_OPT,
    ..._opt,
    concurrency: _opt.concurrency || DEF_OPT.concurrency,
  }
  const { patterns, concurrency, verbose, silent, debug, dry } = opt

  if (debug) {
    console.log(opt)
  }

  // 1. glob only files, expand dirs, delete

  const filenames = await globby(patterns, {
    dot: true,
    expandDirectories: true,
    onlyFiles: true,
  })

  if (verbose || debug || dry) {
    console.log(`Will delete ${yellow(filenames.length)} files:`, filenames)
  }

  if (dry) return

  await pMap(filenames, filepath => fs.remove(filepath), { concurrency })

  // 2. glob only dirs, expand, delete only empty!
  let dirnames = await globby(patterns, {
    dot: true,
    expandDirectories: true,
    onlyDirectories: true,
  })

  // Add original patterns (if any of them are dirs)
  dirnames = dirnames.concat(
    await pFilter(patterns, async pattern => {
      return (await fs.pathExists(pattern)) && (await fs.lstat(pattern)).isDirectory()
    }),
  )

  const dirnamesSorted = dirnames.sort().reverse()

  // console.log({ dirnamesSorted })

  const deletedDirs = await pFilter(
    dirnamesSorted,
    async dirpath => {
      if (await isEmptyDir(dirpath)) {
        // console.log(`empty dir: ${dirpath}`)
        await fs.remove(dirpath)
        return true
      }
      return false
    },
    { concurrency: 1 },
  )

  if (verbose || debug) console.log({ deletedDirs })

  if (!silent) {
    console.log(
      `del deleted ${yellow(filenames.length)} files and ${yellow(
        deletedDirs.length,
      )} dirs ${dimGrey(_since(started))}`,
    )
  }
}

// Improved algorithm:
// 1. glob only files, expand dirs, delete
// 2. glob only dirs, expand, delete only empty!
// 3. test each original pattern, if it exists and is directory and is empty - delete

async function isEmptyDir(dir: string): Promise<boolean> {
  return (await fs.readdir(dir)).length === 0
}
