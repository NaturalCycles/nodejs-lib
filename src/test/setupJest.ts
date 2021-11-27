import { jestLog, jestLogger, jestOffline } from '@naturalcycles/dev-lib/dist/testing'
import { Debug } from '..'

Debug.enable('nc:*')

jestOffline()

// Patch console functions so jest doesn't log it so verbose
console.log = console.warn = jestLog
console.error = jestLogger.error.bind(jestLogger)
