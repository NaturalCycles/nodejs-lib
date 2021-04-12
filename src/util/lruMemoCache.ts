import { MemoCache } from '@naturalcycles/js-lib'
import LRUCache = require('lru-cache')

export type LRUMemoCacheOpts = LRUCache.Options<string, any>

/**
 * @example
 * Use it like this:
 *
 * @_Memo({ cacheFactory: () => new LRUMemoCache({...}) })
 * method1 ()
 */
export class LRUMemoCache implements MemoCache {
  constructor(opt: LRUMemoCacheOpts) {
    this.lru = new LRUCache<string, any>(opt)
  }

  private lru!: LRUCache<string, any>

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
    this.lru.reset()
  }
}
