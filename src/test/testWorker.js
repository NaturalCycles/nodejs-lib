const { parentPort, workerData } = require('worker_threads')

console.log(`testWorker.js created`, { workerData })

// console.log(process.env)

parentPort.on('message', msg => {
  setTimeout(() => {
    if (msg === null) {
      // console.log(`EXIT (null) received by ${index}, exiting`)
      parentPort.close()
      return
    }

    // console.log(`message received by worker ${index}: `, msg)
    const { index, payload } = msg
    parentPort.postMessage({
      index,
      payload, // echo back
    })
  }, 200)
})
