import { generateBuildInfo } from './buildInfo.util'

test('generateBuildInfo', () => {
  let buildInfo = generateBuildInfo()
  // console.log(buildInfo)
  expect(buildInfo).toMatchObject({
    repoName: 'nodejs-lib',
    env: 'test',
  })

  process.env['APP_ENV'] = ''
  buildInfo = generateBuildInfo()
  // console.log(buildInfo)
  expect(buildInfo.env).toBe('master') // read from package.json
})
