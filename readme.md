## @naturalcycles/nodejs-lib

> Standard library for Node.js

[![npm](https://img.shields.io/npm/v/@naturalcycles/nodejs-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/nodejs-lib)
[![publish size](https://badgen.net/packagephobia/publish/@naturalcycles/nodejs-lib)](https://packagephobia.now.sh/result?p=@naturalcycles/nodejs-lib)
[![install size](https://badgen.net/packagephobia/install/@naturalcycles/nodejs-lib)](https://packagephobia.now.sh/result?p=@naturalcycles/nodejs-lib)
[![](https://circleci.com/gh/NaturalCycles/nodejs-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/nodejs-lib)
[![Maintainability](https://api.codeclimate.com/v1/badges/119a3b4735c4ed81cf84/maintainability)](https://codeclimate.com/github/NaturalCycles/nodejs-lib/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/119a3b4735c4ed81cf84/test_coverage)](https://codeclimate.com/github/NaturalCycles/nodejs-lib/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Features

- Validation (based on Joi)
- debug (based on debug) with .warn(), .error() levels
- env.util
- zip.util
- id.util (based on nanoid)
- hash.util
- process.util (cpu, memory, etc)
- lruMemoCache (implementation of MemoCache based on lru-cache)
- SlackService
- [Secrets](./doc/secrets.md)

# Exports

- `/` root
- `/bin` cli
  - yargs
  - globby
- `/script`
  - exports `runScript` lightweight function (0 deps)
- `/exec`
  - execa
- `/colors`
  - only chalk

# Packaging

- `engines.node`: Latest Node.js LTS
- `main: dist/index.js`: commonjs, es2019
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
