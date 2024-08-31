import cp from 'node:child_process'
import path from 'node:path'
import type { UnixTimestampNumber } from '@naturalcycles/js-lib'
import { grey } from '../colors/colors'
import { exec2 } from './exec2'

/**
 * Set of utility functions to work with git.
 */
class Git2 {
  getLastGitCommitMsg(): string {
    return exec2.exec('git log -1 --pretty=%B')
  }

  commitMessageToTitleMessage(msg: string): string {
    const firstLine = msg.split('\n')[0]!
    const [preTitle, title] = firstLine.split(': ')
    return title || preTitle!
  }

  gitHasUncommittedChanges(): boolean {
    // git diff-index --quiet HEAD -- || echo "untracked"
    try {
      cp.execSync('git diff-index --quiet HEAD --', {
        encoding: 'utf8',
      })
      return false
    } catch {
      return true
    }
  }

  /**
   * Returns true if there were changes
   */
  gitCommitAll(msg: string): boolean {
    // git commit -a -m "style(lint-all): $GIT_MSG" || true
    const cmd = `git commit -a --no-verify -m "${msg}"`
    // const cmd = `git`
    // const args = ['commit', '-a', '--no-verify', '-m', msg]
    console.log(grey(cmd))

    try {
      cp.execSync(cmd, {
        stdio: 'inherit',
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * @returns true if there are not pushed commits.
   */
  gitIsAhead(): boolean {
    // ahead=`git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
    const cmd = `git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
    const stdout = exec2.exec(cmd)
    // console.log(`gitIsAhead: ${stdout}`)
    return Number(stdout) > 0
  }

  gitPull(): void {
    const cmd = 'git pull'
    try {
      cp.execSync(cmd, {
        stdio: 'inherit',
      })
    } catch {}
  }

  gitPush(): void {
    // git push --set-upstream origin $CIRCLE_BRANCH && echo "pushed, exiting" && exit 0
    let cmd = 'git push'

    const branchName = this.gitCurrentBranchName()

    if (branchName) {
      cmd += ` --set-upstream origin ${branchName}`
    }

    exec2.spawn(cmd, { logStart: true })
  }

  gitCurrentCommitSha(full = false): string {
    const sha = exec2.exec('git rev-parse HEAD')
    return full ? sha : sha.slice(0, 7)
  }

  gitCurrentCommitTimestamp(): UnixTimestampNumber {
    return Number(exec2.exec('git log -1 --format=%ct'))
  }

  gitCurrentBranchName(): string {
    return exec2.exec('git rev-parse --abbrev-ref HEAD')
  }

  gitCurrentRepoName(): string {
    const originUrl = exec2.exec('git config --get remote.origin.url')
    return path.basename(originUrl, '.git')
  }
}

export const git2 = new Git2()
