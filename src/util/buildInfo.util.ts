import {
  _filterUndefinedValues,
  AnyObject,
  BuildInfo,
  localTime,
  UnixTimestamp,
} from '@naturalcycles/js-lib'
import { fs2 } from '../fs/fs2'
import { git2 } from './git2'

export interface GenerateBuildInfoOptions {
  /**
   * If set - this timestamp will be used, instead of "current time".
   */
  overrideTimestamp?: UnixTimestamp
}

export function generateBuildInfo(opt: GenerateBuildInfoOptions = {}): BuildInfo {
  const now = localTime.orNow(opt.overrideTimestamp)
  const ts = now.unix

  const rev = git2.getCurrentCommitSha()
  const branchName = git2.getCurrentBranchName()
  const repoName = git2.getCurrentRepoName()
  const tsCommit = git2.getCurrentCommitTimestamp()

  const ver = [now.toStringCompact(), repoName, branchName, rev].join('_')

  let { APP_ENV: env } = process.env

  if (!env) {
    // Attempt to read `envByBranch` from package.json root
    try {
      if (fs2.pathExists('package.json')) {
        const packageJson = fs2.readJson<AnyObject>('package.json')
        env = packageJson?.['envByBranch']?.[branchName] || packageJson?.['envByBranch']?.['*']
      }
    } catch {}
  }

  return _filterUndefinedValues({
    ts,
    tsCommit,
    repoName,
    branchName,
    rev,
    ver,
    env,
  })
}
