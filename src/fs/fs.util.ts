/*

Why?

Convenience re-export/re-implementation of most common fs functions from
node:fs, node:fs/promises and fs-extra

Defaults to string input/output, as it's used in 80% of time. For the rest - you can use native fs.

Allows to import it easier, so you don't have to choose between the 3 import locations.
That's why function names are slightly renamed, to avoid conflict.

Credit to: fs-extra (https://github.com/jprichardson/node-fs-extra)

 */

import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import { _jsonParse } from '@naturalcycles/js-lib'
import type { CopyOptions, CopyOptionsSync, MoveOptions } from 'fs-extra'
import * as fse from 'fs-extra'

export interface JsonOptions {
  spaces?: number
}

/**
 * Convenience wrapper that defaults to utf-8 string output.
 */
export async function _readFile(filePath: string): Promise<string> {
  return await fsp.readFile(filePath, 'utf8')
}

/**
 * Convenience wrapper that defaults to utf-8 string output.
 */
export function _readFileSync(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8')
}

export async function _readJsonFile<T = unknown>(filePath: string): Promise<T> {
  const str = await fsp.readFile(filePath, 'utf8')
  return _jsonParse(str)
}

export function _readJsonFileSync<T = unknown>(filePath: string): T {
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

export async function _writeJsonFile(
  filePath: string,
  data: any,
  opt?: JsonOptions,
): Promise<void> {
  const str = JSON.stringify(data, null, opt?.spaces)
  await fsp.writeFile(filePath, str)
}

export function _writeJsonFileSync(filePath: string, data: any, opt?: JsonOptions): void {
  const str = JSON.stringify(data, null, opt?.spaces)
  fs.writeFileSync(filePath, str)
}

export async function _outputJsonFile(
  filePath: string,
  data: any,
  opt?: JsonOptions,
): Promise<void> {
  const str = JSON.stringify(data, null, opt?.spaces)
  await _outputFile(filePath, str)
}

export function _outputJsonFileSync(filePath: string, data: any, opt?: JsonOptions): void {
  const str = JSON.stringify(data, null, opt?.spaces)
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

// Skipping `_ensureFile` (async), until it's needed

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

// copyFile/moveFile - let's keep using fs-extra for now

export async function _copyPath(src: string, dest: string, opt?: CopyOptions): Promise<void> {
  await fse.copy(src, dest, opt)
}

export function _copyPathSync(src: string, dest: string, opt?: CopyOptionsSync): void {
  fse.copySync(src, dest, opt)
}

export async function _movePath(src: string, dest: string, opt?: MoveOptions): Promise<void> {
  await fse.move(src, dest, opt)
}

export function _movePathSync(src: string, dest: string, opt?: MoveOptions): void {
  fse.moveSync(src, dest, opt)
}
