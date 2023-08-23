/*

Why?

Convenience re-export/re-implementation of most common fs functions from
node:fs, node:fs/promises and fs-extra

Defaults to string input/output, as it's used in 80% of time. For the rest - you can use native fs.

Allows to import it easier, so you don't have to choose between the 3 import locations.
That's why function names are slightly renamed, to avoid conflict.

Credit to: fs-extra (https://github.com/jprichardson/node-fs-extra)

 */

import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { _jsonParse } from '@naturalcycles/js-lib'

/**
 * fs2 conveniently groups filesystem functions together.
 * Supposed to be almost a drop-in replacement for these things together:
 *
 * 1. node:fs
 * 2. node:fs/promises
 * 3. fs-extra
 */
export const fs2 = {
  // "Omit" is here to workaround this TS error:
  // Exported variable 'fs2' has or is using name 'StreamOptions' from external module "fs" but cannot be named.
  ...(fs as Omit<typeof fs, 'StreamOptions'>),
  readFile: _readFile,
  readFileSync: _readFileSync,
  readFileAsBuffer: _readFileAsBuffer,
  readFileAsBufferSync: _readFileAsBufferSync,
  readJson: _readJson,
  readJsonSync: _readJsonSync,
  writeFile: _writeFile,
  writeFileSync: _writeFileSync,
  outputJson: _outputJson,
  outputJsonSync: _outputJsonSync,
  writeJson: _writeJson,
  writeJsonSync: _writeJsonSync,
  outputFile: _outputFile,
  outputFileSync: _outputFileSync,
  pathExists: _pathExists,
  pathExistsSync: _pathExistsSync,
  ensureDir: _ensureDir,
  ensureDirSync: _ensureDirSync,
  ensureFile: _ensureFile,
  ensureFileSync: _ensureFileSync,
  removePath: _removePath,
  removePathSync: _removePathSync,
  emptyDir: _emptyDir,
  emptyDirSync: _emptyDirSync,
  copyPath: _copyPath,
  copyPathSync: _copyPathSync,
  movePath: _movePath,
  movePathSync: _movePathSync,
}

export interface JsonOptions {
  spaces?: number
}

/**
 * Convenience wrapper that defaults to utf-8 string output.
 */
export async function _readFile(filePath: string): Promise<string> {
  return await fsp.readFile(filePath, 'utf8')
}

export async function _readFileAsBuffer(filePath: string): Promise<Buffer> {
  return await fsp.readFile(filePath)
}

/**
 * Convenience wrapper that defaults to utf-8 string output.
 */
export function _readFileSync(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8')
}

/**
 * Convenience wrapper that defaults to utf-8 string output.
 */
export function _readFileAsBufferSync(filePath: string): Buffer {
  return fs.readFileSync(filePath)
}

export async function _readJson<T = unknown>(filePath: string): Promise<T> {
  const str = await fsp.readFile(filePath, 'utf8')
  return _jsonParse(str)
}

export function _readJsonSync<T = unknown>(filePath: string): T {
  const str = fs.readFileSync(filePath, 'utf8')
  return _jsonParse(str)
}

export async function _writeFile(filePath: string, data: string | Buffer): Promise<void> {
  await fsp.writeFile(filePath, data)
}

export function _writeFileSync(filePath: string, data: string | Buffer): void {
  fs.writeFileSync(filePath, data)
}

export async function _outputFile(filePath: string, data: string | Buffer): Promise<void> {
  const dirPath = path.dirname(filePath)
  if (!(await _pathExists(dirPath))) {
    await _ensureDir(dirPath)
  }

  await fsp.writeFile(filePath, data)
}

export function _outputFileSync(filePath: string, data: string | Buffer): void {
  const dirPath = path.dirname(filePath)
  if (!fs.existsSync(dirPath)) {
    _ensureDirSync(dirPath)
  }

  fs.writeFileSync(filePath, data)
}

function stringify(data: any, opt?: JsonOptions): string {
  // If pretty-printing is enabled (spaces) - also add a newline at the end (to match our prettier config)
  return JSON.stringify(data, null, opt?.spaces) + (opt?.spaces ? '\n' : '')
}

export async function _writeJson(filePath: string, data: any, opt?: JsonOptions): Promise<void> {
  const str = stringify(data, opt)
  await fsp.writeFile(filePath, str)
}

export function _writeJsonSync(filePath: string, data: any, opt?: JsonOptions): void {
  const str = stringify(data, opt)
  fs.writeFileSync(filePath, str)
}

export async function _outputJson(filePath: string, data: any, opt?: JsonOptions): Promise<void> {
  const str = stringify(data, opt)
  await _outputFile(filePath, str)
}

export function _outputJsonSync(filePath: string, data: any, opt?: JsonOptions): void {
  const str = stringify(data, opt)
  _outputFileSync(filePath, str)
}

export async function _pathExists(filePath: string): Promise<boolean> {
  try {
    await fsp.access(filePath)
    return true
  } catch {
    return false
  }
}

export function _pathExistsSync(filePath: string): boolean {
  return fs.existsSync(filePath)
}

export async function _ensureDir(dirPath: string): Promise<void> {
  await fsp.mkdir(dirPath, {
    mode: 0o777,
    recursive: true,
  })
}

export function _ensureDirSync(dirPath: string): void {
  fs.mkdirSync(dirPath, {
    mode: 0o777,
    recursive: true,
  })
}

export async function _ensureFile(filePath: string): Promise<void> {
  let stats
  try {
    stats = await fsp.stat(filePath)
  } catch {}
  if (stats?.isFile()) return

  const dir = path.dirname(filePath)
  try {
    if (!(await fsp.stat(dir)).isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      await fsp.readdir(dir)
    }
  } catch (err) {
    // If the stat call above failed because the directory doesn't exist, create it
    if ((err as any)?.code === 'ENOENT') return await _ensureDir(dir)
    throw err
  }

  await fsp.writeFile(filePath, '')
}

export function _ensureFileSync(filePath: string): void {
  let stats
  try {
    stats = fs.statSync(filePath)
  } catch {}
  if (stats?.isFile()) return

  const dir = path.dirname(filePath)
  try {
    if (!fs.statSync(dir).isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      fs.readdirSync(dir)
    }
  } catch (err) {
    // If the stat call above failed because the directory doesn't exist, create it
    if ((err as any)?.code === 'ENOENT') return _ensureDirSync(dir)
    throw err
  }

  fs.writeFileSync(filePath, '')
}

export async function _removePath(fileOrDirPath: string): Promise<void> {
  await fsp.rm(fileOrDirPath, { recursive: true, force: true })
}

export function _removePathSync(fileOrDirPath: string): void {
  fs.rmSync(fileOrDirPath, { recursive: true, force: true })
}

export async function _emptyDir(dirPath: string): Promise<void> {
  let items
  try {
    items = await fsp.readdir(dirPath)
  } catch {
    return await _ensureDir(dirPath)
  }

  await Promise.all(items.map(item => _removePath(path.join(dirPath, item))))
}

export function _emptyDirSync(dirPath: string): void {
  let items
  try {
    items = fs.readdirSync(dirPath)
  } catch {
    return _ensureDirSync(dirPath)
  }

  items.forEach(item => _removePathSync(path.join(dirPath, item)))
}

/**
 * Cautious, underlying Node function is currently Experimental.
 */
export async function _copyPath(src: string, dest: string, opt?: fs.CopyOptions): Promise<void> {
  await fsp.cp(src, dest, {
    recursive: true,
    ...opt,
  })
}

/**
 * Cautious, underlying Node function is currently Experimental.
 */
export function _copyPathSync(src: string, dest: string, opt?: fs.CopySyncOptions): void {
  fs.cpSync(src, dest, {
    recursive: true,
    ...opt,
  })
}

export async function _movePath(src: string, dest: string, opt?: fs.CopyOptions): Promise<void> {
  await _copyPath(src, dest, opt)
  await _removePath(src)
}

export function _movePathSync(src: string, dest: string, opt?: fs.CopySyncOptions): void {
  _copyPathSync(src, dest, opt)
  _removePathSync(src)
}
