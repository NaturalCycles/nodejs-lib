import { Observable, Subject } from 'rxjs'
import { writableForEach, _pipeline } from '../..'
import { TransformMapOptions } from '../..'
import { ReadableTyped } from '../stream.model'

export function streamToObservable<T>(
  stream: ReadableTyped<T>,
  opt?: TransformMapOptions,
): Observable<T> {
  const subj = new Subject<T>()

  void _pipeline([stream, writableForEach<T>(r => subj.next(r), opt)]).then(
    () => subj.complete(),
    err => subj.error(err),
  )

  return subj
}
