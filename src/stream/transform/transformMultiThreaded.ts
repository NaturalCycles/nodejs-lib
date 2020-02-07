import { DeferredPromise, pDeferredPromise, _range } from '@naturalcycles/js-lib'
import { Transform } from 'stream'
import { Worker } from 'worker_threads'
import { TransformOpt, TransformTyped } from '../stream.model'

export interface TransformMultiThreadedOptions extends TransformOpt {
  /**
   * Absolute path to a js file with worker code
   */
  workerFile: string

  /**
   * @default 2, to match CircleCI and Github Actions environments
   */
  poolSize?: number
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
  const { workerFile, poolSize = 2 } = opt

  let index = 0
  let tr: Transform = undefined as any
  const donePromises: DeferredPromise<Error | undefined>[] = []

  const workers = _range(0, poolSize).map(index => {
    donePromises.push(pDeferredPromise())

    const worker = new Worker(workerFile, {
      workerData: index,
    })

    // const {threadId} = worker
    // console.log({threadId})

    worker.on('error', err => {
      console.error(`Worker ${index} error`, err)
      donePromises[index].resolve(err)
    })

    worker.on('exit', exitCode => {
      // console.log(`Worker ${index} exit: ${exitCode}`)
      donePromises[index].resolve(undefined)
    })

    worker.on('message', v => {
      // console.log(`Message from Worker ${index}:`, v)
      tr.push(v)
    })

    return worker
  })

  tr = new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _encoding, cb) {
      const worker = workers[++index % poolSize] // round-robin

      worker.postMessage(chunk)

      cb()
    },
    async final(cb) {
      try {
        // Push null (complete) to all sub-streams
        workers.forEach(worker => worker.postMessage(null))

        console.log(`transformMultiThreaded.final is waiting for all chains to be done`)
        await Promise.all(donePromises)
        console.log(`transformMultiThreaded.final all chains done`)
        cb()
      } catch (err) {
        cb(err)
      }
    },
  })

  return tr
}
