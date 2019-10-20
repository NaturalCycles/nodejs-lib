import { toArray } from 'rxjs/operators'
import { Readable } from 'stream'
import { streamToObservable, StreamToObservableOptions } from './streamToObservable'

/**
 * Reads stream, resolves promise with array of stream results in the end.
 */
export async function streamToArray<T = any>(
  stream: Readable,
  opt: StreamToObservableOptions<T, T> = {},
): Promise<T[]> {
  return await streamToObservable<T, T>(stream, opt)
    .pipe(toArray())
    .toPromise()
}
