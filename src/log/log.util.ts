import { commonLoggerCreate } from '@naturalcycles/js-lib'
import { inspectAny } from '../index'

/**
 * CommonLogger that logs to process.stdout directly (bypassing console.log).
 */
export const stdoutLogger = commonLoggerCreate((_level, args) => {
  process.stdout.write(args.map(a => inspectAny(a)).join(' ') + '\n')
})
