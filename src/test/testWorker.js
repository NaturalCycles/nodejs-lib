const { parentPort, workerData } = require('worker_threads')

const index = workerData

console.log(`testWorker.js ${index} created`)

// console.log(process.env)

parentPort.on('message', msg => {
  setTimeout(() => {
    if (msg === null) {
      // console.log(`EXIT (null) received by ${index}, exiting`)
      parentPort.close()
      return
    }

    // console.log(`message received by worker ${index}: `, msg)
    parentPort.postMessage(msg)
  }, 500)
})
