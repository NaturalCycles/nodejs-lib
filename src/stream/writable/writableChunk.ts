import { Writable } from 'node:stream'
import { promisify } from 'node:util'
import { _deepCopy, _last } from '@naturalcycles/js-lib'
import {
  TransformOptions,
  TransformTyped,
  WritableTyped,
  transformNoOp,
} from '@naturalcycles/nodejs-lib'

// This is a helper function to create a promise which resolves when the stream emits a 'finish'
// event.
// This is used to await all the writables in the final method of the writableChunk
async function awaitFinish(stream: Writable): Promise<unknown> {
  return await promisify(((cb: any) => stream.on('finish', cb)).bind(stream))()
}
/**
 * Generates an array of [arr[i], arr[i+1]] tuples from the input array.
 * The resulting array will have a length of `arr.length - 1`.
 * ```ts
 * successiveElements([1, 2, 3, 4]) // [[1, 2], [2, 3], [3, 4]]
 * ```
 */
function successiveElements<T>(arr: T[]): [T, T][] {
  const tuples: [T, T][] = []
  const arrCopy = _deepCopy(arr)
  for (let i = 1; i < arrCopy.length; i++) {
    tuples.push([arrCopy[i - 1]!, arrCopy[i]!])
  }
  return tuples
}
/**
 * Allows to split the output to multiple files by splitting into chunks
 * based on `shouldSplitFn`.
 * `transformFactories` are used to create a chain of transforms for each chunk.
 * It was meant to be used with createGzip, which needs a proper start and end for each chunk
 * for the output file to be a valid gzip file.
 *
 * @experimental
 */
export function writableChunk<T>(
  shouldSplitFn: (row: T) => boolean,
  transformFactories: (() => TransformTyped<T, T>)[],
  writableFactory: (index: number) => WritableTyped<T>,
  opt?: TransformOptions,
): WritableTyped<T> {
  let currentSplitIndex = 0
  // We don't want to have an empty chain, so we add a no-op transform
  if (transformFactories.length === 0) {
    transformFactories.push(transformNoOp<T>)
  }

  // Create the transforms as well as the Writable, and pipe them together
  let currentWritable = writableFactory(currentSplitIndex)
  let transforms = transformFactories.map(f => f())
  successiveElements(transforms).forEach(([t1, t2]) => t1.pipe(t2))
  _last(transforms).pipe(currentWritable)

  // We keep track of all the pending writables, so we can await them in the final method
  const writablesFinish: Promise<unknown>[] = [awaitFinish(currentWritable)]

  return new Writable({
    objectMode: true,
    ...opt,
    write(chunk: T, _, cb) {
      // pipe will take care of piping the data through the different streams correctly
      transforms[0]!.write(chunk, cb)

      if (shouldSplitFn(chunk)) {
        console.log(`writableChunk splitting at index: ${currentSplitIndex}`)
        currentSplitIndex++
        transforms[0]!.end()

        currentWritable = writableFactory(currentSplitIndex)
        transforms = transformFactories.map(f => f())
        successiveElements(transforms).forEach(([t1, t2]) => t1.pipe(t2))
        _last(transforms).pipe(currentWritable)

        writablesFinish.push(awaitFinish(currentWritable))
      }
    },
    async final(cb) {
      try {
        transforms[0]!.end()
        await Promise.all(writablesFinish)
        cb()
      } catch (err) {
        cb(err as Error)
      }
    },
  })
}
