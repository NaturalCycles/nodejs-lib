import { Readable } from 'stream'
import { streamToObservable, StreamToObservableOptions } from './streamToObservable'

/**
 * Reads stream, calls a mapper function for each item. Resolves promise when all items are done and processed.
 *
 * It's a simplified version of streamToObservable.
 */
export async function streamMap<IN = any>(
  stream: Readable,
  opt: StreamToObservableOptions<IN, any> = {},
): Promise<void> {
  await streamToObservable<IN, any>(stream, opt).toPromise()
}
