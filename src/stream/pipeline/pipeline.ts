import { pipeline } from 'stream'
import { promisify } from 'util'

type AnyStream = NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream

/**
 * Promisified stream.pipeline()
 */
export let _pipeline = promisify(pipeline)

// Workaround https://github.com/nodejs/node/issues/40191
// todo: remove it when fix is released in 16.x and in AppEngine 16.x
if (process.version >= 'v16.10') {
  const { pipeline } = require('stream/promises')
  _pipeline = ((streams: AnyStream[]) => pipeline(...streams)) as any
}
