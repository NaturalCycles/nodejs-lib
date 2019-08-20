import { Observable } from 'rxjs'
import { publish } from 'rxjs/operators'

/**
 * Converts Node.js ReadableStream to RxJS Observable.
 *
 * Based on  https://github.com/Reactive-Extensions/rx-node/blob/master/index.js
 */
export function streamToObservable<T = any> (
  stream: NodeJS.ReadableStream,
  finishEventName = 'end',
  dataEventName = 'data',
): Observable<T> {
  stream.pause()

  return publish<T>()(
    new Observable<T>(observer => {
      const dataHandler = (data: T) => observer.next(data)
      const errorHandler = (err: any) => observer.error(err)
      const endHandler = () => observer.complete()

      stream
        .addListener(dataEventName, dataHandler)
        .addListener('error', errorHandler)
        .addListener(finishEventName, endHandler)

      stream.resume()

      return () => {
        stream
          .removeListener(dataEventName, dataHandler)
          .removeListener('error', errorHandler)
          .removeListener(finishEventName, endHandler)
      }
    }),
  ).refCount()
}
