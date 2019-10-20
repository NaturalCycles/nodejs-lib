import { toArray } from 'rxjs/operators'
import { ReadableTyped } from './stream.model'
import { streamToObservable, StreamToObservableOptions } from './streamToObservable'

/**
 * Reads stream, resolves promise with array of stream results in the end.
 */
export async function streamToArray<IN, OUT = IN>(
  stream: ReadableTyped<IN>,
  opt: StreamToObservableOptions<IN, OUT> = {},
): Promise<OUT[]> {
  return await streamToObservable<IN, OUT>(stream, opt)
    .pipe(toArray())
    .toPromise()
}
