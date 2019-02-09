import { processSharedUtil } from './process.shared.util'

test('cpuInfo', async () => {
  const c = processSharedUtil.cpuInfo()
  // console.log(c)
  expect(c).toHaveProperty('count')
})

test('memoryUsage', async () => {
  const c = processSharedUtil.memoryUsage()
  // console.log(c)
  expect(c).toHaveProperty('heapUsed')
})
