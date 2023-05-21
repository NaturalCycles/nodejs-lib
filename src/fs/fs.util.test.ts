import { testDir } from '../test/paths.cnst'
import {
  _ensureDir,
  _ensureDirSync,
  _ensureFile,
  _ensureFileSync,
  _pathExists,
  _pathExistsSync,
  _readFile,
  _readFileSync,
  _readJsonFile,
  _readJsonFileSync,
} from './fs.util'

test('readFile', async () => {
  const someFilePath = `${testDir}/someFile.json`

  let r = _readFileSync(someFilePath)
  expect(r).toContain('aaa')
  r = await _readFile(someFilePath)
  expect(r).toContain('aaa')

  let o = _readJsonFileSync(someFilePath)
  expect(o).toMatchInlineSnapshot(`
    {
      "a": "aaa",
      "b": "bbb",
    }
  `)
  o = await _readJsonFile(someFilePath)
  expect(o).toMatchInlineSnapshot(`
    {
      "a": "aaa",
      "b": "bbb",
    }
  `)

  expect(_pathExistsSync(testDir)).toBe(true)
  expect(await _pathExists(testDir)).toBe(true)

  _ensureDirSync(testDir)
  await _ensureDir(testDir)
  _ensureFileSync(someFilePath)
  await _ensureFile(someFilePath)
})
