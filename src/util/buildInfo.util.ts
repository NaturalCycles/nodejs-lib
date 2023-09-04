import {
  _filterUndefinedValues,
  AnyObject,
  BuildInfo,
  localTimeOrNow,
  UnixTimestampNumber,
} from '@naturalcycles/js-lib'
import { _pathExistsSync, _readJsonSync } from '../fs/fs.util'
import {
  gitCurrentBranchName,
  gitCurrentCommitSha,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
} from './git.util'

export interface GenerateBuildInfoOptions {
  /**
   * If set - this timestamp will be used, instead of "current time".
   */
  overrideTimestamp?: UnixTimestampNumber
}

export function generateBuildInfo(opt: GenerateBuildInfoOptions = {}): BuildInfo {
  const now = localTimeOrNow(opt.overrideTimestamp)
  const ts = now.unix()

  const rev = gitCurrentCommitSha()
  const branchName = gitCurrentBranchName()
  const repoName = gitCurrentRepoName()
  const tsCommit = gitCurrentCommitTimestamp()

  const ver = [now.toStringCompact(), repoName, branchName, rev].join('_')

  let { APP_ENV: env } = process.env

  if (!env) {
    // Attempt to read `envByBranch` from package.json root
    try {
      if (_pathExistsSync('package.json')) {
        const packageJson = _readJsonSync<AnyObject>('package.json')
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
