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
  console.log(buildInfo)
  expect(buildInfo.env).not.toBe('test') // read from package.json
})
