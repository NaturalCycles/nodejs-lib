import execa = require('execa')
import { dimGrey, grey } from '../colors'

export interface ExecaOptions extends execa.Options {
  /**
   * If true - it will reject a promise with an error and NOT do `process.exit`
   */
  noProcessExit?: boolean
}

export async function proxyCommand(
  cmd: string,
  args: string[] = [],
  opt: ExecaOptions = {},
): Promise<void> {
  const processArgs = process.argv.slice(2)

  await execWithArgs(cmd, [...args, ...processArgs], {
    ...opt,
  })
}

export async function execCommand(cmd: string, opt: ExecaOptions = {}): Promise<void> {
  logExec(cmd, [], opt)

  await execa
    .command(cmd, {
      stdio: 'inherit',
      preferLocal: true,
      ...opt,
    })
    .catch(err => handleError(err, cmd, opt))
}

export async function execWithArgs(
  cmd: string,
  args: string[] = [],
  opt: ExecaOptions = {},
): Promise<void> {
  logExec(cmd, args, opt)

  await execa(cmd, args, {
    stdio: 'inherit',
    preferLocal: true,
    ...opt,
  }).catch(err => handleError(err, cmd, opt))
}

export async function execShell(cmd: string, opt: ExecaOptions = {}): Promise<void> {
  await execCommand(cmd, {
    shell: true,
    ...opt,
  })
}

function handleError(err: execa.ExecaError, cmd: string, opt: ExecaOptions = {}): void {
  if (opt.noProcessExit) {
    throw err || new Error(`execCommand failed: ${cmd}`)
  }

  if (err) {
    if (err.originalMessage) {
      console.log(dimGrey(err.originalMessage))
    } else if (err.shortMessage) {
      console.log(dimGrey(err.shortMessage))
    } else {
      console.error(err)
    }

    if (err.exitCode) {
      process.exit(err.exitCode)
    }
  }

  process.exit(1)
}

export function logExec(cmd: string, args: string[] = [], opt: ExecaOptions = {}): void {
  const cmdline = [
    ...Object.entries(opt.env || {}).map(([k, v]) => [k, v].join('=')),
    cmd,
    ...args,
  ].join(' ')

  console.log(grey(cmdline))
}
