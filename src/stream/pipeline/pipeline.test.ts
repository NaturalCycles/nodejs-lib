import { _range, createAbortableSignal, pExpectedErrorString } from '@naturalcycles/js-lib'
import { expect, test } from 'vitest'
import { readableFromArray } from '../readable/readableFromArray'
import { transformTap } from '../transform/transformTap'
import { writablePushToArray } from '../writable/writablePushToArray'
import { _pipeline, PipelineOptions } from './pipeline'

test('abort pipeline with AbortSignal', async () => {
  const data = _range(1, 50).map(n => ({ id: String(n) }))

  // First, without allowGracefulAbort it should throw
  expect(await pExpectedErrorString(runPipeline())).toMatchInlineSnapshot(`
"AbortError: The operation was aborted
code: ABORT_ERR
Caused by: AbortError: This operation was aborted"
`)

  // Now with allowGracefulAbort
  const arr = await runPipeline({ allowGracefulAbort: true })

  expect(arr).toEqual(data.slice(0, 5))

  async function runPipeline(opt: PipelineOptions = {}): Promise<any[]> {
    const sourceReadable = readableFromArray(data)
    const signal = createAbortableSignal()

    const arr: any[] = []

    await _pipeline(
      [
        sourceReadable,
        transformTap((_row, i) => {
          // console.log(i, arr)
          if (i === 5) {
            signal.abort()
          }
        }),
        writablePushToArray(arr),
      ],
      { signal, ...opt },
    )

    return arr
  }
})
