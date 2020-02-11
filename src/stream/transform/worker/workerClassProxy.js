const started = Date.now()
const { workerData, parentPort } = require('worker_threads')
const { workerFile, workerIndex } = workerData || {}

if (!workerFile) {
  throw new Error('workerData.workerFile is required!')
}

// console.log(`worker#${workerIndex} created`)

try {
  require('ts-node/register/transpile-only')
  require('tsconfig-paths/register')
} catch {} // require if exists

const { WorkerClass } = require(workerFile)
const worker = new WorkerClass(workerData)

console.log(`worker#${workerIndex} loaded in ${Date.now() - started} ms`)

parentPort.on('message', async msg => {
  if (msg === null) {
    // console.log(`EXIT (null) received by ${index}, exiting`)
    parentPort.close()
    return
  }

  // console.log(`message received by worker ${index}: `, msg)

  try {
    const out = await worker.process(msg.payload, msg.index)
    if (out.error) throw out.error

    parentPort.postMessage({
      index: msg.index,
      payload: out,
    })
  } catch (err) {
    parentPort.postMessage({
      index: msg.index,
      error: err,
    })
  }
})
