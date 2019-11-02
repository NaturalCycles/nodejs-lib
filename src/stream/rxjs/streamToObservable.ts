import { Observable, Subject } from 'rxjs'
import { _pipeline } from '../..'
import { ReadableTyped } from '../stream.model'
import { transformMap, TransformMapOptions } from '../transform/transformMap'

export function streamToObservable<T>(
  stream: ReadableTyped<T>,
  opt?: TransformMapOptions,
): Observable<T> {
  const subj = new Subject<T>()

  void _pipeline([stream, transformMap<T, void>(r => subj.next(r), opt)]).then(
    () => subj.complete(),
    err => subj.error(err),
  )

  return subj
}
