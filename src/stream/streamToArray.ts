import { toArray } from 'rxjs/operators'
import { Readable } from 'stream'
import { streamToObservable, StreamToObservableOptions } from './streamToObservable'

/**
 * Reads stream, resolves promise with array of stream results in the end.
 */
export async function streamToArray<IN = any, OUT = IN>(
  stream: Readable,
  opt: StreamToObservableOptions<IN, OUT> = {},
): Promise<OUT[]> {
  return await streamToObservable<IN, OUT>(stream, opt)
    .pipe(toArray())
    .toPromise()
}
