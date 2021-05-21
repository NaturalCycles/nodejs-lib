import { DeferredPromise, pDefer, _range } from '@naturalcycles/js-lib'
import through2Concurrent = require('through2-concurrent')
import { Worker } from 'worker_threads'
import { TransformOpt, TransformTyped } from '../../stream.model'
import { WorkerInput, WorkerOutput } from './transformMultiThreaded.model'

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
   * @default to poolSize
   */
  concurrency?: number

  /**
   * @default to Math.max(16, concurrency x 2)
   */
  highWaterMark?: number

  /**
   * Passed to the Worker as `workerData` property (initial data).
   */
  workerData?: Record<string, any>
}

const workerProxyFilePath = `${__dirname}/workerClassProxy.js`

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
  const maxConcurrency = opt.concurrency || poolSize
  const highWaterMark = Math.max(16, maxConcurrency)
  const objectMode = opt.objectMode !== false // default true

  console.log({
    poolSize,
    maxConcurrency,
    highWaterMark,
  })

  const workerDonePromises: DeferredPromise<Error | undefined>[] = []
  const messageDonePromises: Record<number, DeferredPromise<OUT>> = {}
  let index = -1 // input chunk index, will start from 0

  const workers = _range(0, poolSize).map(workerIndex => {
    workerDonePromises.push(pDefer())

    const worker = new Worker(workerProxyFilePath, {
      workerData: {
        workerIndex,
        workerFile, // pass it, so workerProxy can require() it
        ...workerData,
      },
    })

    // const {threadId} = worker
    // console.log({threadId})

    worker.on('error', err => {
      console.error(`Worker ${workerIndex} error`, err)
      workerDonePromises[workerIndex]!.reject(err)
    })

    worker.on('exit', _exitCode => {
      // console.log(`Worker ${index} exit: ${exitCode}`)
      workerDonePromises[workerIndex]!.resolve(undefined)
    })

    worker.on('message', (out: WorkerOutput<OUT>) => {
      // console.log(`Message from Worker ${workerIndex}:`, out)
      // console.log(Object.keys(messageDonePromises))
      // tr.push(out.payload)
      if (out.error) {
        messageDonePromises[out.index]!.reject(out.error)
      } else {
        messageDonePromises[out.index]!.resolve(out.payload)
      }
    })

    return worker
  })

  return (objectMode ? through2Concurrent.obj : through2Concurrent)(
    {
      maxConcurrency,
      highWaterMark,
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
      messageDonePromises[currentIndex] = pDefer<OUT>()

      const worker = workers[currentIndex % poolSize]! // round-robin
      worker.postMessage({
        index: currentIndex,
        payload: chunk,
      } as WorkerInput)

      try {
        // awaiting for result
        const out = await messageDonePromises[currentIndex]
        // console.log('awaited!')
        // return the result
        cb(null, out)
      } catch (err) {
        // Currently we only support ErrorMode.SUPPRESS
        // Error is logged and output continues
        console.error(err)

        cb() // emit nothing in case of an error
      }

      // clean up
      delete messageDonePromises[currentIndex]
    },
  )
}
