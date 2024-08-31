import { git2 } from './git2'

test('getLastGitCommitMsg', async () => {
  const msg = git2.getLastGitCommitMsg()
  console.log({ msg })
  expect(msg).toBeDefined()

  const title = git2.commitMessageToTitleMessage(msg)
  console.log({ title })
  expect(title).toBeDefined()
})

test('gitHasUncommittedChanges', async () => {
  const changes = git2.gitHasUncommittedChanges()
  console.log({ changes })
})

test('gitCurrentBranchName', async () => {
  const branchName = git2.gitCurrentBranchName()
  console.log(branchName)
})

test('gitCurrentRepoName', async () => {
  git2.gitCurrentRepoName()
})

test('gitCurrentCommitTimestamp', async () => {
  const ts = git2.gitCurrentCommitTimestamp()
  console.log(ts, new Date(ts * 1000))
})
