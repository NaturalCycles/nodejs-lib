# nodejs-lib

> Standard library for Node.js

![npm](https://img.shields.io/npm/v/@naturalcycles/nodejs-lib/latest.svg)
![Actions](https://github.com/NaturalCycles/nodejs-lib/workflows/default/badge.svg)
![loc](https://badgen.net/codeclimate/loc/NaturalCycles/nodejs-lib)
![Maintainability](https://api.codeclimate.com/v1/badges/119a3b4735c4ed81cf84/maintainability)
![Test Coverage](https://api.codeclimate.com/v1/badges/119a3b4735c4ed81cf84/test_coverage)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

# Features

- Validation (based on Joi)
- env.util
- zip.util
- id.util (based on nanoid)
- hash.util
- process.util (cpu, memory, etc)
- lruMemoCache (implementation of MemoCache based on lru-cache)
- SlackService
- [Secrets](./doc/secrets.md)
- kpy, del [fs](./doc/fs.md)

#### Other commands

- `json2env`: for specified `.json` file will create `.json.sh` file next to it that will "export"
  all values of json file as environment variables. Will also append \$BASH_ENV (if defined) for
  CircleCI. Example: `yarn json2env someFile.json` will create `someFile.json.sh`
  - `--prefix` will prepend all keys with `prefix` string, e.g `--prefix buildInfo_` will output as
    `buildInfo_key1`, `buildInfo_key2`, etc.
  - `--no-save-env-file` to skip saving `.sh` file
  - `--no-bash-env` to skip adding to `$BASH_ENV`
  - `--no-fail` will not throw error on missing input file
  - `--silent`
  - `--debug`

# Exports

- `/` root
- `/bin` cli
  - yargs
- `/script`
  - exports `runScript` lightweight function (0 deps)
- `/exec`
  - execa
- `/colors`
  - only chalk
- `/fs`
  - exports `kpy`, `kpySync`, `del`, `json2env`

# Packaging

- `engines.node`: Latest Node.js LTS
- `main: dist/index.js`: commonjs, es2020
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
