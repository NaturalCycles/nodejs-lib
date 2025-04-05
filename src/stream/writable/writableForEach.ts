import type { AsyncMapper, Mapper } from '@naturalcycles/js-lib'
import { _passNothingPredicate } from '@naturalcycles/js-lib'
import type { TransformMapOptions } from '../..'
import { transformMap, transformMapSync } from '../..'
import type { WritableTyped } from '../stream.model'

/**
 * Just an alias to transformMap that declares OUT as void.
 */
export function writableForEach<IN = any>(
  mapper: AsyncMapper<IN, void>,
  opt: TransformMapOptions<IN, void> = {},
): WritableTyped<IN> {
  return transformMap<IN, void>(mapper, { ...opt, predicate: _passNothingPredicate })
}

/**
 * Just an alias to transformMap that declares OUT as void.
 */
export function writableForEachSync<IN = any>(
  mapper: Mapper<IN, void>,
  opt: TransformMapOptions<IN, void> = {},
): WritableTyped<IN> {
  return transformMapSync<IN, void>(mapper, { ...opt, predicate: _passNothingPredicate })
}
