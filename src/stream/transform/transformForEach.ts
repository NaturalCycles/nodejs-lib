import { Mapper, passNothingPredicate } from '@naturalcycles/js-lib'
import { TransformTyped } from '../stream.model'
import { transformMap, TransformMapOptions } from './transformMap'

/**
 * Just an alias to transformMap that declares OUT as void.
 */
export function transformForEach<IN = any>(
  mapper: Mapper<IN, any>,
  opt: TransformMapOptions = {},
): TransformTyped<IN, void> {
  return transformMap<IN, void>(mapper, { ...opt, predicate: passNothingPredicate })
}
