import { DeferredPromise, pDeferredPromise, _range } from '@naturalcycles/js-lib'
import * as through2Concurrent from 'through2-concurrent'
import { Worker } from 'worker_threads'
import { TransformOpt, TransformTyped } from '../stream.model'

export interface WorkerInput<IN = any> {
  /**
   * Index of the chunk received (global), which identifies the message. Starts with 0.
   */
  index: number

  /**
   * Input chunk data.
   */
  payload: IN
}

export interface WorkerOutput<OUT = any> {
  /**
   * Index of the chunk received (global), which identifies the message. Starts with 0.
   */
  index: number

  /**
   * Output of the worker.
   */
  payload: OUT
}

export interface TransformMultiThreadedOptions extends TransformOpt {
  /**
   * Absolute path to a js file with worker code
   */
  workerFile: string

  /**
   * @default 2, to match CircleCI and Github Actions environments
   */
  poolSize?: number

  /**
   * Passed to the Worker as `workerData` property (initial data).
   */
  workerData?: object
}

/**
 * Spawns a pool of Workers (threads).
 * Distributes (using round-robin, equally) all inputs over Workers.
 * Workers emit 1 output for each 1 input.
 * Output of Workers is passed down the stream. Order is RANDOM (since it's a multi-threaded environment).
 */
export function transformMultiThreaded<IN, OUT>(
  opt: TransformMultiThreadedOptions,
): TransformTyped<IN, OUT> {
  const { workerFile, poolSize = 2, workerData } = opt
  const objectMode = opt.objectMode !== false // default true

  const workerDonePromises: DeferredPromise<Error | undefined>[] = []
  const messageDonePromises: Record<number, DeferredPromise<OUT>> = {}
  let index = -1 // input chunk index, will start from 0

  const workers = _range(0, poolSize).map(workerIndex => {
    workerDonePromises.push(pDeferredPromise())

    const worker = new Worker(workerFile, {
      workerData: {
        workerIndex,
        ...workerData,
      },
    })

    // const {threadId} = worker
    // console.log({threadId})

    worker.on('error', err => {
      console.error(`Worker ${workerIndex} error`, err)
      workerDonePromises[workerIndex].resolve(err)
    })

    worker.on('exit', _exitCode => {
      // console.log(`Worker ${index} exit: ${exitCode}`)
      workerDonePromises[workerIndex].resolve(undefined)
    })

    worker.on('message', (out: WorkerOutput<OUT>) => {
      // console.log(`Message from Worker ${workerIndex}:`, out)
      // console.log(Object.keys(messageDonePromises))
      // tr.push(out.payload)
      messageDonePromises[out.index].resolve(out.payload)
    })

    return worker
  })

  return (objectMode ? through2Concurrent.obj : through2Concurrent)(
    {
      maxConcurrency: poolSize,
      async final(cb) {
        try {
          // Push null (complete) to all sub-streams
          workers.forEach(worker => worker.postMessage(null))

          console.log(`transformMultiThreaded.final is waiting for all chains to be done`)
          await Promise.all(workerDonePromises)
          console.log(`transformMultiThreaded.final all chains done`)

          cb()
        } catch (err) {
          cb(err)
        }
      },
    },
    async function transformMapFn(chunk: IN, _encoding, cb) {
      // Freezing the index, because it may change due to concurrency
      const currentIndex = ++index

      // Create the unresolved promise (to avait)
      messageDonePromises[currentIndex] = pDeferredPromise<OUT>()

      const worker = workers[currentIndex % poolSize] // round-robin
      worker.postMessage({
        index: currentIndex,
        payload: chunk,
      } as WorkerInput)

      // awaiting for result
      const out = await messageDonePromises[currentIndex]
      // console.log('awaited!')

      // clean up
      delete messageDonePromises[currentIndex]

      // return the result
      cb(null, out)
    },
  )
}
