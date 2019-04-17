# [4.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v4.1.0...v4.2.0) (2019-04-17)


### Features

* JoiValidationError.objectName, objectId ([92aa2ef](https://github.com/NaturalCycles/nodejs-lib/commit/92aa2ef))

# [4.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v4.0.1...v4.1.0) (2019-04-16)


### Features

* **validation:** truncate long validation message ([6e70bb1](https://github.com/NaturalCycles/nodejs-lib/commit/6e70bb1))

## [4.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v4.0.0...v4.0.1) (2019-03-10)


### Bug Fixes

* joi stripUnknown.arrays=false (very important!) ([b874766](https://github.com/NaturalCycles/nodejs-lib/commit/b874766))

# [4.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v3.0.1...v4.0.0) (2019-03-09)


### Code Refactoring

* "flatten" util classes into functions ([aa93bbe](https://github.com/NaturalCycles/nodejs-lib/commit/aa93bbe))


### BREAKING CHANGES

* similar to js-lib, functions are exported directly, not wrapped into "util classes" anymore.

## [3.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v3.0.0...v3.0.1) (2019-02-23)


### Bug Fixes

* instanceof JoiValidationError ([f6be36e](https://github.com/NaturalCycles/nodejs-lib/commit/f6be36e))

# [3.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v2.3.0...v3.0.0) (2019-02-16)


### Code Refactoring

* moving things around ([6169c65](https://github.com/NaturalCycles/nodejs-lib/commit/6169c65))


### Features

* joi dateStringCalendarAccuracy (credit to [@oskojo](https://github.com/oskojo)) ([6464267](https://github.com/NaturalCycles/nodejs-lib/commit/6464267))


### BREAKING CHANGES

* Not exporting GotService, getDebug, localDateUtil anymore (they're "in progress", not production ready yet).

# [2.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v2.2.0...v2.3.0) (2019-02-09)


### Bug Fixes

* use [@naturalcycles](https://github.com/naturalcycles)/semantic-release, bump js-lib dep ([5217e38](https://github.com/NaturalCycles/nodejs-lib/commit/5217e38))


### Features

* zipSharedUtil ([7d84a14](https://github.com/NaturalCycles/nodejs-lib/commit/7d84a14))

# [2.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v2.1.0...v2.2.0) (2019-02-09)


### Features

* upgrade deps, processSharedUtil ([26e49cb](https://github.com/NaturalCycles/nodejs-lib/commit/26e49cb))

# [2.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v2.0.0...v2.1.0) (2019-02-02)


### Features

* slugSchema, slug pattern ([f897db6](https://github.com/NaturalCycles/nodejs-lib/commit/f897db6))

# [2.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v1.0.1...v2.0.0) (2019-02-02)


### Features

* joiValidationError to return errorItems ([0bcb603](https://github.com/NaturalCycles/nodejs-lib/commit/0bcb603))


### BREAKING CHANGES

* renamed AppValidationError to JoiValidationError

## [1.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v1.0.0...v1.0.1) (2018-11-16)


### Bug Fixes

* package.main ([7b0fc1b](https://github.com/NaturalCycles/nodejs-lib/commit/7b0fc1b))

# 1.0.0 (2018-11-10)


### Features

* publish first version ([c06d3e0](https://github.com/NaturalCycles/nodejs-lib/commit/c06d3e0))
