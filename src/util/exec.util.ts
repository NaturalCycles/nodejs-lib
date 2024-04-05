import type { ProcessEnvOptions, SpawnOptions } from 'node:child_process'
import cp from 'node:child_process'

export interface ExecOptions extends SpawnOptions {
  /**
   * Defaults to true.
   * Set to false to skip logging.
   */
  log?: boolean
}

export async function execVoidCommand(
  cmd: string,
  args: string[] = [],
  opt: ExecOptions = {},
): Promise<void> {
  logExec(cmd, args, opt)

  await new Promise<void>(resolve => {
    const p = cp.spawn(cmd, [...args], {
      stdio: 'inherit',
      // shell: true,
      ...opt,
      env: {
        ...process.env,
        ...opt.env,
      },
    })

    p.on('close', code => {
      if (code) {
        console.log(`${cmd} exited with code ${code}`)
        process.exit(code)
      }
      resolve()
    })
  })
}

export function execVoidCommandSync(cmd: string, args: string[] = [], opt: ExecOptions = {}): void {
  logExec(cmd, args, opt)

  const r = cp.spawnSync(cmd, [...args], {
    encoding: 'utf8',
    stdio: 'inherit',
    // shell: true, // removing shell breaks executing `tsc`
    ...opt,
    env: {
      ...process.env,
      ...opt.env,
    },
  })

  if (r.status) {
    console.log(`${cmd} exited with code ${r.status}`)
    process.exit(r.status)
  }

  if (r.error) {
    console.log(r.error)
    process.exit((r.error as NodeJS.ErrnoException).errno || 1)
  }
}

function logExec(
  cmd: string,
  args: string[] = [],
  opt: ProcessEnvOptions & ExecOptions = {},
): void {
  if (opt.log === false) return

  const cmdline = [
    ...Object.entries(opt.env || {}).map(([k, v]) => [k, v].join('=')),
    cmd,
    ...args,
  ].join(' ')

  console.log(cmdline)
}
