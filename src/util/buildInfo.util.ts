import { _filterUndefinedValues, AnyObject, BuildInfo, localTime } from '@naturalcycles/js-lib'
import { _pathExistsSync, _readJsonSync } from '../fs/fs.util'
import {
  gitCurrentBranchName,
  gitCurrentCommitSha,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
} from './git.util'

export function generateBuildInfo(): BuildInfo {
  const now = localTime()
  const ts = now.unix()
  const tsStr = now.toPretty()

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
    tsStr,
    repoName,
    branchName,
    rev,
    ver,
    env,
  })
}
