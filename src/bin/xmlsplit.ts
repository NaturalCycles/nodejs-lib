#!/usr/bin/env node

import * as yargs from 'yargs'
import { xmlSplit, XmlSplitOptions, XmlSplitPattern } from '../fs/xmlsplit'
import { runScript } from '../script'

runScript(async () => {
  const {
    _: [baseDir, ...inputPatterns],
    ...opt
  } = yargs.demandCommand(2).options({
    silent: {
      type: 'boolean',
      descr: 'Suppress all text output', // todo: desc!
    },
    splitPatterns: {
      type: 'string',
      demandOption: true,
      description: 'JSON array of split patterns',
    },
    verbose: {
      type: 'boolean',
      descr: 'Report progress on every file',
    },
    dotfiles: {
      type: 'boolean',
    },
    xpath: {
      type: 'string',
      demandOption: true,
      description:
        'xpath selector for element whose attributes will be matched. Must match elements directly in root element',
    },
  }).argv

  const outputDir = inputPatterns.pop() as string

  const splitPatterns = JSON.parse(opt.splitPatterns).map((o: any) => ({
    key: o.key,
    regex: new RegExp(o.regex),
    inverse: o.inverse,
  })) as XmlSplitPattern[]

  const xmlSplitOpt: XmlSplitOptions = {
    baseDir: baseDir as string,
    inputPatterns: inputPatterns as string[],
    outputDir,
    ...opt,
    splitPatterns,
  }

  await xmlSplit(xmlSplitOpt)
})
