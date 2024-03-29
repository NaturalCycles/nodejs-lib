import path from 'node:path'

export const projectDir = path.join(`${__dirname}/../..`)
export const tmpDir = `${projectDir}/tmp`
export const testDir = `${projectDir}/src/test`
export const secretDir = projectDir + '/secret'
export const scriptsDir = projectDir + '/scripts'
