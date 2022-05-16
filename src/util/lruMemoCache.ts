import { MemoCache } from '@naturalcycles/js-lib'
import * as LRUCache from 'lru-cache'

// Partial, to be able to provide default `max`
export type LRUMemoCacheOptions<KEY, VALUE> = Partial<LRUCache.Options<KEY, VALUE>>

/**
 * @example
 * Use it like this:
 *
 * @_Memo({ cacheFactory: () => new LRUMemoCache({...}) })
 * method1 ()
 */
export class LRUMemoCache<KEY = any, VALUE = any> implements MemoCache<KEY, VALUE> {
  constructor(opt: LRUMemoCacheOptions<KEY, VALUE>) {
    this.lru = new LRUCache<KEY, VALUE>({
      max: 100,
      ...opt,
    })
  }

  private lru!: LRUCache<KEY, VALUE>

  has(k: any): boolean {
    return this.lru.has(k)
  }

  get(k: any): any {
    return this.lru.get(k)
  }

  set(k: any, v: any): void {
    this.lru.set(k, v)
  }

  clear(): void {
    this.lru.clear()
  }
}
