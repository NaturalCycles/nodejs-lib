import { ReadableTyped } from './stream.model'
import { streamToObservable, StreamToObservableOptions } from './streamToObservable'

/**
 * Reads stream, calls a mapper function for each item. Resolves promise when all items are done and processed.
 *
 * It's a simplified version of streamToObservable.
 */
export async function streamMap<IN>(
  stream: ReadableTyped<IN>,
  opt: StreamToObservableOptions<IN, any> = {},
): Promise<void> {
  await streamToObservable(stream, opt).toPromise()
}
