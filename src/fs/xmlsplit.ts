import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import { DOMParser, XMLSerializer } from 'xmldom'
import * as xpath from 'xpath'
import { boldWhite, dimGrey, grey, yellow } from '../colors'

/**
 * Everything defaults to `undefined`.
 */
export interface XmlSplitOptions {
  /**
   * @default . (cwd)
   */
  baseDir: string

  /**
   * @default to `**` (everything, including sub-dirs)
   */
  inputPatterns?: string[]

  /**
   * @default . (cwd)
   */
  outputDir: string

  silent?: boolean
  /*
   json key values where key will be split filename suffix and value regex
   */
  splitPatterns: XmlSplitPattern[]
  verbose?: boolean

  dotfiles?: boolean

  xpath: string
}

export interface XmlSplitPattern {
  key: string
  regex: RegExp
  inverse?: boolean
}

export interface XmlSplitResult {
  key: string
  xml: string
}

export async function xmlSplit(opt: XmlSplitOptions): Promise<void> {
  splitPrepare(opt)

  const filenames = await globby(opt.inputPatterns!, {
    cwd: opt.baseDir,
    dot: opt.dotfiles,
  })

  xmlSplitLogFilenames(opt, filenames)

  await Promise.all(
    filenames.map(async filename => {
      const basename = path.basename(filename)
      const srcFilename = path.resolve(opt.baseDir, filename)
      const xmlIn: string = (await fs.readFile(srcFilename)).toString()
      const outputs = await _xmlSplit(xmlIn, opt.xpath, opt.splitPatterns)

      for (const output of outputs) {
        const s = basename.split('.')
        const suffix = s.pop()
        const destPrefix = s.join('')
        const destFilename = path.resolve(opt.baseDir, destPrefix + '-' + output.key + '.' + suffix)
        await fs.writeFile(destFilename, output.xml)
        console.log(grey(`  ${destFilename}`))
      }
    }),
  )
}

function splitPrepare(opt: XmlSplitOptions): void {
  // Default pattern
  if (!opt.inputPatterns?.length) opt.inputPatterns = ['**']

  // default to cwd
  opt.baseDir ||= '.'
  opt.outputDir ||= '.'

  if (!fs.existsSync(opt.baseDir)) {
    console.log(`kpy: baseDir doesn't exist: ${boldWhite(opt.baseDir)}`)
    return
  }

  fs.ensureDirSync(opt.outputDir)
}

function xmlSplitLogFilenames(opt: XmlSplitOptions, filenames: string[]): void {
  if (opt.silent) return

  console.log(
    `Will split ${yellow(filenames.length)} files from ${dimGrey(opt.baseDir)} to ${dimGrey(
      opt.outputDir,
    )} (${dimGrey(opt.inputPatterns!.join(' '))})`,
  )
}

export async function _xmlSplit(
  xml: string,
  path: string,
  patterns: XmlSplitPattern[],
): Promise<XmlSplitResult[]> {
  // TODO: support elements at any depth

  // parse xml
  const parsed = new DOMParser().parseFromString(xml)

  // find matching elements
  // xpath typings not available
  const nodes: any = xpath.select(path, parsed)

  const serializer = new XMLSerializer()
  const results = {}
  // Check patterns.regex against all attributes of the nodes
  for (const node of nodes) {
    // Awkward way of getting iterable attributes...
    const attr = Object.values(node.attributes).filter((o: any) =>
      o.hasOwnProperty('specified'),
    ) as any[]
    for (const pattern of patterns) {
      if (!pattern.inverse) {
        for (const el of attr) {
          const strToSearch = el.value
          if (pattern.regex.test(strToSearch)) {
            results[pattern.key] = results[pattern.key] ? [...results[pattern.key], node] : [node]
            break
          }
        }
      } else {
        let match = false
        for (const el of attr) {
          const strToSearch = el.value
          if (pattern.regex.test(strToSearch)) {
            match = true
            break
          }
        }
        if (!match) {
          results[pattern.key] = results[pattern.key] ? [...results[pattern.key], node] : [node]
        }
      }
    }
  }
  // Find container node, clear contents
  const root = parsed.documentElement

  const strResults: XmlSplitResult[] = []
  for (const key of Object.getOwnPropertyNames(results)) {
    const copy = root.cloneNode(false)
    for (const elem of results[key]) {
      copy.appendChild(elem)
    }
    strResults.push({
      key,
      xml: serializer.serializeToString(copy),
    })
  }

  return strResults
}
