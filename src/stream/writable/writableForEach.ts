import { Mapper, passNothingPredicate } from '@naturalcycles/js-lib'
import { transformMap, TransformMapOptions } from '../..'
import { WritableTyped } from '../stream.model'

/**
 * Just an alias to transformMap that declares OUT as void.
 */
export function writableForEach<IN = any>(
  mapper: Mapper<IN, void>,
  opt: TransformMapOptions = {},
): WritableTyped<IN> {
  return transformMap<IN, void>(mapper, { ...opt, predicate: passNothingPredicate })
}
