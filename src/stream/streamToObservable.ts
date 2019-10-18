import { Observable } from 'rxjs'
import { publish } from 'rxjs/operators'

/**
 * Extends Observable, similar to ReadableStream's .pause() and .resume().
 */
export interface PausableObservable<T> extends Observable<T> {
  pause(): void
  resume(): void
}

export interface StreamToObservableOptions {
  /**
   * @default 'data'
   */
  dataEventName?: string

  /**
   * @default 'end'
   */
  finishEventName?: string
}

/**
 * Converts Node.js ReadableStream to RxJS Observable.
 *
 * Based on  https://github.com/Reactive-Extensions/rx-node/blob/master/index.js
 */
export function streamToObservable<T = any>(
  stream: NodeJS.ReadableStream,
  opt: StreamToObservableOptions = {},
): PausableObservable<T> {
  const { dataEventName = 'data', finishEventName = 'end' } = opt

  stream.pause()

  const obs = new Observable<T>(observer => {
    const dataHandler = (data: T) => observer.next(data)
    const errorHandler = (err: any) => observer.error(err)
    const endHandler = () => observer.complete()

    stream
      .on(dataEventName, dataHandler)
      .on('error', errorHandler)
      .on(finishEventName, endHandler)

    stream.resume()

    return () => {
      stream
        .off(dataEventName, dataHandler)
        .off('error', errorHandler)
        .off(finishEventName, endHandler)
    }
  })

  const obs2 = publish<T>()(obs).refCount() as PausableObservable<T>
  obs2.pause = () => stream.pause()
  obs2.resume = () => stream.resume()
  return obs2
}
