# Features

- Dead simple (see examples), minimalistic
- Provides both CLI and API (so you don't need 2 separate packages)
- Provides Typescript typings (so you don't need 3 separate packages)
- Relies on proven lower-level libs (globby, cp-file, yargs)
- Report progress to STDOUT by default (unless `--silent` is used)

Just run `kpy help` to see CLI options.

# API commands

- `kpy` - copy/move files/folders
- `del` - delete files/folders

# CLI API

```sh

kpy <baseDir> <pattern1> <pattern2> ... <outputDir>

# Example, copy all from `test` to `out`:

kpy test out

# Example, copy all `*.txt` file from `test`, except `one.txt` to `out`:

kpy test '**/*.txt' '!**/one.txt' out

```

Options:

- `--silent` - don't output anything
- `--verbose` - report progress on every file
- `--dotfiles` - include files starting with `.`
- `--no-overwrite` - don't overwrite
- `--flat` - flatten the output folders
- `--dry` - don't copy (useful for debugging)
- `--move` - move files instead of copy
- `help` - show available options

# Why

`cpy` has issue with `--cwd`, `--parents`. `--parents` should be default, and `cwd` is confusing.

`cpx` is amazing, but doesn't support multiple globs and therefore negation globs (e.g
`test/* !test/one.txt`)

## Example 1

Copy all files/dirs while keeping directory structure from `test/*` to `out`.

Simple, right?

#### cpy

    cpy ** ../out --cwd test --parent

Possible, but not trivial to figure out `..out`, `--cwd`, etc.

#### cpx

    cpx out test

Works really well here!

## Example 2

Copy all files/dirs while keeping directory structure from `test/*.txt` to `out`, excluding
`one.txt`.

Simple, right?

#### cpy

    cpy ** !**/one.txt ../out --cwd test --parent

Possible, but not trivial to figure out `..out`, `--cwd`, etc.

#### cpx

Not possible to exclude :(

# del

This package also provides `del` cli (api similar and inspired by
[del](https://github.com/sindresorhus/del).

Examples:

```sh

# Delete everything under `dist`, including `dist`:
del dist

# Delete everything under `dist`, NOT including `dist` (important to quote globs!):
del 'dist/**'

# Delete all .json files under `dist`:
del 'dist/**/*.json'

# Delete all, but .json files under `dist`:
del dist '!**/*.json'

# Delete folders `a`, `b` and `c`:
del a b c

```
