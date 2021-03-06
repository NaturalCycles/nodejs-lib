import * as fse from 'fs-extra'
const fs = require('fs')
const fsp = require('fs').promises
import { projectDir, scriptsDir, tmpDir } from '../test/paths.cnst'
import { json2env, kpy, kpySync } from './index'

beforeAll(() => {
  jest.spyOn(fs, 'writeFileSync').mockImplementation()
  jest.spyOn(fs, 'unlinkSync').mockImplementation()
  jest.spyOn(fs, 'mkdirSync').mockImplementation()
  jest.spyOn(fs, 'copyFileSync').mockImplementation()
  jest.spyOn(fs, 'unlinkSync').mockImplementation()
  jest.spyOn(fs, 'renameSync').mockImplementation()
  jest.spyOn(fse, 'writeFileSync').mockImplementation()
  jest.spyOn(fse, 'unlinkSync').mockImplementation()
  jest.spyOn(fse, 'mkdirSync').mockImplementation()
  jest.spyOn(fse, 'copyFileSync').mockImplementation()
  jest.spyOn(fse, 'unlinkSync').mockImplementation()
  jest.spyOn(fsp, 'rename').mockImplementation()
  jest.spyOn(fsp, 'mkdir').mockImplementation()
  jest.spyOn(fsp, 'copyFile').mockImplementation()
  jest.spyOn(fsp, 'unlink').mockImplementation()
})

const outputDir = `${tmpDir}/debug/kpy`
const inputPatterns = ['*.json']

test('kpy', async () => {
  kpySync({
    baseDir: scriptsDir,
    outputDir,
    inputPatterns,
  })

  // Trying different options for coverage
  kpySync({
    baseDir: scriptsDir,
    outputDir,
    verbose: true,
    flat: true,
  })

  kpySync({
    baseDir: scriptsDir,
    outputDir,
    silent: true,
    move: true,
  })

  await kpy({
    baseDir: scriptsDir,
    outputDir,
    silent: true,
  })

  await kpy({
    baseDir: scriptsDir,
    outputDir,
    dry: true,
    verbose: true,
    flat: true,
  })

  await kpy({
    baseDir: scriptsDir,
    outputDir,
    move: true,
    silent: true,
  })

  // kpySync({
  //   // for coverage
  //   baseDir: undefined as any,
  //   outputDir: undefined as any,
  //   dry: true,
  // })
})

test('json2env', async () => {
  const jsonPath = `${projectDir}/tsconfig.prod.json`

  json2env({
    jsonPath,
  })

  // Different options for coverage
  json2env({
    jsonPath,
    debug: true,
    saveEnvFile: false,
  })
})
