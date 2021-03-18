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
- `xml-split` - split xml files 

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
# xml-split

This package also provides `xml-split` cli that takes a glob pattern of xml files and splits it into multiple files 
with the following caveats:
* Expects xpath to elements directly under root object
* Uses regex to search all attributes of the specified element(s)

Examples:

```sh

xml-split --xpath="<xpath selector>" --splitPatterns="<json array of key-value pairs - key:regex>" <baseDir> <pattern1> <pattern2> ... <outputDir>

Example 1:
# Split junit xml into multiple files based test suite string expected in some attribute of testcase
xml-split --xpath="//testcase" --splitPatterns='[{"key": "Suite1", "regex": "TS-1"}, {"key": "Suite2", "regex": "TS-2"}, {"key": "other", "regex": "1028|1103", "inverse": true}]' . junit.xml . 

# Assuming such test cases are found, outputs: 
junit-Suite1.xml # Containing all test cases that has TS-1 in the testcase attributes
junit-Suite2.xml # Containing all test cases that has TS-2 in the testcase attributes
```
