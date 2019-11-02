import { pipeline } from 'stream'
import { promisify } from 'util'

/**
 * Promisified stream.pipeline()
 */
export const _pipeline = promisify(pipeline)
