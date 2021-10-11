# [12.39.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.38.0...v12.39.0) (2021-10-11)


### Features

* **joi:** oneOfSchema ([8376400](https://github.com/NaturalCycles/nodejs-lib/commit/8376400aa384e2c88fc4e66f17cb0575eac63296))

# [12.38.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.37.0...v12.38.0) (2021-10-06)


### Features

* TransformLogOptions.peakRSS to log peak rss ([4602565](https://github.com/NaturalCycles/nodejs-lib/commit/4602565c8e52d17d8bd975f73e0f2bd6df03cf8b))

# [12.37.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.36.0...v12.37.0) (2021-10-04)


### Features

* cleanup, support only objectMode=true in transformMap ([540b397](https://github.com/NaturalCycles/nodejs-lib/commit/540b3972eaa5d1a630c53af6d0f5af1e4e22b6ba))

# [12.36.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.35.0...v12.36.0) (2021-10-04)


### Features

* transformNoOp ([14e50ec](https://github.com/NaturalCycles/nodejs-lib/commit/14e50ecb78923464b3665e9317837bb78ad6add1))

# [12.35.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.34.0...v12.35.0) (2021-10-01)


### Features

* inspectAny depth defaults to 10 now (was: 6) ([601f0b2](https://github.com/NaturalCycles/nodejs-lib/commit/601f0b29220e84de2feed2b3648313093e6c3f59))

# [12.34.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.33.4...v12.34.0) (2021-09-10)


### Features

* getAjv to enable `instanceof` keyword ([f8e07e8](https://github.com/NaturalCycles/nodejs-lib/commit/f8e07e8bd4730099467711d955e4df42421b32ad))

## [12.33.4](https://github.com/NaturalCycles/nodejs-lib/compare/v12.33.3...v12.33.4) (2021-09-09)


### Bug Fixes

* SlackService to include error data and stack by default ([153c62c](https://github.com/NaturalCycles/nodejs-lib/commit/153c62cd1a0c6888724b678d2223d9658ec2d0dc))

## [12.33.3](https://github.com/NaturalCycles/nodejs-lib/compare/v12.33.2...v12.33.3) (2021-09-04)


### Bug Fixes

* allow schemaLike in AjvSchemaCfg.schemas ([5a3cc55](https://github.com/NaturalCycles/nodejs-lib/commit/5a3cc556c5ec92cd82ca0c6c32a11f9f97ddb387))

## [12.33.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.33.1...v12.33.2) (2021-09-04)


### Bug Fixes

* jsonSchema type inferrence (again) ([61efb9e](https://github.com/NaturalCycles/nodejs-lib/commit/61efb9e3b3c800b3a2bfb57f8bd1feacc0c022a6))

## [12.33.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.33.0...v12.33.1) (2021-09-04)


### Bug Fixes

* jsonSchema type inferrence ([77f40bf](https://github.com/NaturalCycles/nodejs-lib/commit/77f40bf36d557487175c5525deda4e82ec9a3f51))

# [12.33.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.32.0...v12.33.0) (2021-09-04)


### Features

* change AjvSchema constructor to `create` method ([3416854](https://github.com/NaturalCycles/nodejs-lib/commit/34168541e0e826b6bae7d638e0b92bcbcacd4f0e))

# [12.32.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.31.0...v12.32.0) (2021-09-03)


### Features

* AjvSchema.validate now also returns the object ([000f34a](https://github.com/NaturalCycles/nodejs-lib/commit/000f34a1544a97d9700006b77358125c1826e0ed))

# [12.31.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.30.1...v12.31.0) (2021-08-27)


### Features

* adapt Error as `unknown` to match ts 4.4 ([1ad48ac](https://github.com/NaturalCycles/nodejs-lib/commit/1ad48acec2915fb1e987a0be37ada332ac84849a))

## [12.30.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.30.0...v12.30.1) (2021-08-24)


### Bug Fixes

* transformMapSimple to support SUPPRESS ([146a94d](https://github.com/NaturalCycles/nodejs-lib/commit/146a94d4159be4c5236bd9c71cd33b1816eb8a20))

# [12.30.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.29.0...v12.30.0) (2021-08-24)


### Features

* more verbose/friendly joi error messages ([a5d3e2a](https://github.com/NaturalCycles/nodejs-lib/commit/a5d3e2a48c52ec700c86778161545f8874fb203f))

# [12.29.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.28.0...v12.29.0) (2021-08-24)


### Features

* use inspectAny instead of _stringifyAny ([7fd6d4d](https://github.com/NaturalCycles/nodejs-lib/commit/7fd6d4db2ac18752e7d1c3b9b2a7a0b6e54af828))

# [12.28.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.27.0...v12.28.0) (2021-08-24)


### Features

* make `inspectAny` use `_stringifyAny` ([3505a5b](https://github.com/NaturalCycles/nodejs-lib/commit/3505a5b14f3388e9115487be0f3024284cd4a87f))

# [12.27.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.26.0...v12.27.0) (2021-08-23)


### Features

* restore `readableMapToArray` ([f1a908b](https://github.com/NaturalCycles/nodejs-lib/commit/f1a908b140d7537290d1044a3b6b691aefc4469f))

# [12.26.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.25.0...v12.26.0) (2021-08-21)


### Features

* refactor/clarify/cleanup stream methods ([288f154](https://github.com/NaturalCycles/nodejs-lib/commit/288f1545044551576e528fe9f71402254809d7ba))

# [12.25.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.24.0...v12.25.0) (2021-08-21)


### Features

* readableMap, transformMapSimple ([3cd114f](https://github.com/NaturalCycles/nodejs-lib/commit/3cd114f254daa62286f2c21f30385a507c426aed))

# [12.24.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.23.0...v12.24.0) (2021-08-21)


### Features

* readableToArray ([158452d](https://github.com/NaturalCycles/nodejs-lib/commit/158452da32d9d2d40c590b6868399e63e605e922))

# [12.23.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.22.1...v12.23.0) (2021-08-21)


### Features

* readableForEach, readableForEachSync ([ebc20ed](https://github.com/NaturalCycles/nodejs-lib/commit/ebc20ed4e2daa17926a2a73392259aedbf959d86))

## [12.22.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.22.0...v12.22.1) (2021-08-15)


### Bug Fixes

* ajv objectName bug ([aac437e](https://github.com/NaturalCycles/nodejs-lib/commit/aac437e4721d96dedbaa6ecf794cbb05edd34555))

# [12.22.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.21.3...v12.22.0) (2021-08-15)


### Features

* improve AjvSchema ([dd6cfcd](https://github.com/NaturalCycles/nodejs-lib/commit/dd6cfcd642359c43ad9abf15a32077309e54382c))

## [12.21.3](https://github.com/NaturalCycles/nodejs-lib/compare/v12.21.2...v12.21.3) (2021-08-14)


### Bug Fixes

* revert to have SchemaBuilder option ([6ace4b5](https://github.com/NaturalCycles/nodejs-lib/commit/6ace4b5d6fca736778c02888938391d99ea04ad3))

## [12.21.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.21.1...v12.21.2) (2021-08-14)


### Bug Fixes

* simplify/remove JsonSchemaBuilder option ([ca6be9e](https://github.com/NaturalCycles/nodejs-lib/commit/ca6be9e9fc898a1667fd1d5aa8f7f75d0f223661))

## [12.21.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.21.0...v12.21.1) (2021-08-14)


### Bug Fixes

* deps, AjvSchema to use JsonSchema types ([354cfe6](https://github.com/NaturalCycles/nodejs-lib/commit/354cfe614034c4c4d75c93945b74806a3ff0a65a))

# [12.21.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.20.0...v12.21.0) (2021-08-08)


### Features

* add ajv keywords, formats, custom formats ([9e19acf](https://github.com/NaturalCycles/nodejs-lib/commit/9e19acf45e14f360293782cf2f44ca227711903e))

# [12.20.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.19.0...v12.20.0) (2021-08-06)


### Features

* **ajv:** detect objectName from schema.$id ([585d179](https://github.com/NaturalCycles/nodejs-lib/commit/585d1797e8371951b7d348b4c2bbf45e84475521))

# [12.19.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.18.3...v12.19.0) (2021-08-06)


### Features

* ndjsonStreamForEach ([f3dbe80](https://github.com/NaturalCycles/nodejs-lib/commit/f3dbe80190add1a9bb902eecb1d11bd2b44e5288))

## [12.18.3](https://github.com/NaturalCycles/nodejs-lib/compare/v12.18.2...v12.18.3) (2021-08-06)


### Bug Fixes

* export TimeoutError from got ([dcd55b2](https://github.com/NaturalCycles/nodejs-lib/commit/dcd55b241764b71e870b7d191bf7160eef29e214))

## [12.18.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.18.1...v12.18.2) (2021-08-03)


### Bug Fixes

* export HTTPError as class (not as `type`) ([dcf0402](https://github.com/NaturalCycles/nodejs-lib/commit/dcf0402c87fd9ae3c9a5ae995419ff585a339955))

## [12.18.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.18.0...v12.18.1) (2021-08-02)


### Bug Fixes

* AjvSchema separator default to `\n` ([b1a4949](https://github.com/NaturalCycles/nodejs-lib/commit/b1a49491b934ce364f1ab01146759b5cc9497734))

# [12.18.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.17.0...v12.18.0) (2021-08-01)


### Features

* experimental AjvSchema (wrapper around ajv) ([8abedab](https://github.com/NaturalCycles/nodejs-lib/commit/8abedab9022db04d08de1029b4f1c3d6c4b08a85))

# [12.17.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.16.0...v12.17.0) (2021-07-04)


### Features

* transformToString ([17bef5c](https://github.com/NaturalCycles/nodejs-lib/commit/17bef5ce155b53b13239f2a06ed0b409beed0a14))

# [12.16.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.15.1...v12.16.0) (2021-07-04)


### Features

* transformMapSync (experimental) ([202d257](https://github.com/NaturalCycles/nodejs-lib/commit/202d257f72f79d79f98d7c866fa985fc84646151))

## [12.15.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.15.0...v12.15.1) (2021-07-03)


### Bug Fixes

* deps (@types/nodejs@16) ([de38132](https://github.com/NaturalCycles/nodejs-lib/commit/de381326cad6a153c71d083cae9875b2069c3e32))

# [12.15.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.14.5...v12.15.0) (2021-06-28)


### Features

* exec* preferLocal is true by default now ([2f3f900](https://github.com/NaturalCycles/nodejs-lib/commit/2f3f900df09fb683be96076afaf72bb42a5e7a6f))
* ndjson-map logEveryOutput=100k (was: 0) ([7b6f933](https://github.com/NaturalCycles/nodejs-lib/commit/7b6f933a7aee28ad8c0aa6679f2e0493e5feb60d))

## [12.14.5](https://github.com/NaturalCycles/nodejs-lib/compare/v12.14.4...v12.14.5) (2021-05-31)


### Bug Fixes

* ndjson-map to have ErrorMode.SUPPRESS by default ([dcb0203](https://github.com/NaturalCycles/nodejs-lib/commit/dcb0203b5595068ccdfa3a4f5ec1d25f51154f1c))

## [12.14.4](https://github.com/NaturalCycles/nodejs-lib/compare/v12.14.3...v12.14.4) (2021-05-26)


### Bug Fixes

* deps ([e8f7e3e](https://github.com/NaturalCycles/nodejs-lib/commit/e8f7e3e36627c8eb886bd423cd9b450ec8e140bd))

## [12.14.3](https://github.com/NaturalCycles/nodejs-lib/compare/v12.14.2...v12.14.3) (2021-05-21)


### Bug Fixes

* deps, adopt eslint ([6891b85](https://github.com/NaturalCycles/nodejs-lib/commit/6891b8558bc47b7ae6c54201b470e4b9ed96162f))

## [12.14.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.14.1...v12.14.2) (2021-05-03)


### Bug Fixes

* deps ([1af429f](https://github.com/NaturalCycles/nodejs-lib/commit/1af429fd1bcb925a7b4a5a804592ffbd8bc41617))

## [12.14.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.14.0...v12.14.1) (2021-04-17)


### Bug Fixes

* SlackService tests ([cfae25a](https://github.com/NaturalCycles/nodejs-lib/commit/cfae25a5b88d64da95a82c667255fb7622c98e01))

# [12.14.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.13.0...v12.14.0) (2021-03-26)


### Features

* es2020, node14 lts+ ([52bbffd](https://github.com/NaturalCycles/nodejs-lib/commit/52bbffde3b9b1d4dc11438ab8bcf563794540b76))

# [12.13.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.12.2...v12.13.0) (2021-03-12)


### Features

* export more types from Got ([3f58d89](https://github.com/NaturalCycles/nodejs-lib/commit/3f58d8944415911130865cb1e356c2cacaa11fb0))

## [12.12.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.12.1...v12.12.2) (2021-02-25)


### Bug Fixes

* adopt noPropertyAccessFromIndexSignature=true ([6127652](https://github.com/NaturalCycles/nodejs-lib/commit/6127652672ff5ef788b6239453367ded474fd452))

## [12.12.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.12.0...v12.12.1) (2021-02-23)


### Bug Fixes

* `return await` in zip.util ([0233a61](https://github.com/NaturalCycles/nodejs-lib/commit/0233a61b4d92c57a27324a50ef247ea491efe2e8))

# [12.12.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.11.3...v12.12.0) (2021-01-14)


### Features

* percentage schema ([1934db9](https://github.com/NaturalCycles/nodejs-lib/commit/1934db991ad1b97e71c8bb85bb6eacfb962d355f))

## [12.11.3](https://github.com/NaturalCycles/nodejs-lib/compare/v12.11.2...v12.11.3) (2020-12-03)


### Bug Fixes

* deps ([70dbc81](https://github.com/NaturalCycles/nodejs-lib/commit/70dbc81cde4f822c050129eae4f48c9dabc107ed))

## [12.11.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.11.1...v12.11.2) (2020-11-27)


### Bug Fixes

* adopt isolatedModules=true ([471298d](https://github.com/NaturalCycles/nodejs-lib/commit/471298dc87a6e93c84b4fedda684b6ba27dba87e))

## [12.11.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.11.0...v12.11.1) (2020-11-19)


### Bug Fixes

* typescript@4.1, noUncheckedIndexedAccess=true ([beeca6f](https://github.com/NaturalCycles/nodejs-lib/commit/beeca6f524a126e4f28c136f4ede70ccf3e6169f))

# [12.11.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.10.0...v12.11.0) (2020-11-08)


### Features

* transformLogProgress logEvery now defaults to 1000 (was: 100) ([9a9e5b6](https://github.com/NaturalCycles/nodejs-lib/commit/9a9e5b67c555791d00ed224805867c46251ed3f0))

# [12.10.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.9.0...v12.10.0) (2020-11-04)


### Features

* readableFrom convenience type-safe wrapper around Readable.from() ([1a1984e](https://github.com/NaturalCycles/nodejs-lib/commit/1a1984e20530315394a59449bb01848c45544b1c))

# [12.9.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.8.1...v12.9.0) (2020-11-04)


### Features

* streamForEach now includes transformLogProgress ([2e977fd](https://github.com/NaturalCycles/nodejs-lib/commit/2e977fd6c35ff51ff246e6f6693e17b3d0d910d6))

## [12.8.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.8.0...v12.8.1) (2020-11-03)


### Bug Fixes

* export kpy, del, json2env from `/dist/fs` endpoint ([bbfe1d3](https://github.com/NaturalCycles/nodejs-lib/commit/bbfe1d33a53b1e8ad00582636a09adbbd32eb745))

# [12.8.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.7.0...v12.8.0) (2020-11-03)


### Features

* json2env function and cli is moved here from dev-lib ([c4215b3](https://github.com/NaturalCycles/nodejs-lib/commit/c4215b3dc60045b3b07e9c6fdc35d3cac9ae4354))

# [12.7.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.6.0...v12.7.0) (2020-11-03)


### Features

* moved kpy, kpySync, del functions and CLI from fs-lib ([0f5aeac](https://github.com/NaturalCycles/nodejs-lib/commit/0f5aeacc76ea51de2db8c009acd81f977a9eb88f))

# [12.6.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.5.0...v12.6.0) (2020-11-03)


### Features

* runScript to actually call process.exit(1) on error ([a6c2192](https://github.com/NaturalCycles/nodejs-lib/commit/a6c2192759eaa9286ebaf18e934c68c09769cad1))

# [12.5.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.4.1...v12.5.0) (2020-11-01)


### Features

* use sync methods for secret* api and CLI ([9fcc307](https://github.com/NaturalCycles/nodejs-lib/commit/9fcc30754936a12a9c7fd0670198c4bf859e451a))

## [12.4.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.4.0...v12.4.1) (2020-10-30)


### Bug Fixes

* transformLimit to not halt on Node 14 lts ([c7eb15a](https://github.com/NaturalCycles/nodejs-lib/commit/c7eb15a2601c0620c29c47e858193537a718d363))
* use es6-compliant imports ([aec5992](https://github.com/NaturalCycles/nodejs-lib/commit/aec59920ee75241df9e60088d4f96dbb96525720))

# [12.4.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.3.0...v12.4.0) (2020-10-24)


### Features

* inspectAny handles "Error with code" now ([1d678f9](https://github.com/NaturalCycles/nodejs-lib/commit/1d678f9028414fa4a2e596df7b7a1785fe996251))

# [12.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.2.2...v12.3.0) (2020-10-20)


### Features

* getGot now sets default timeout (was: infinite) ([07bc3a9](https://github.com/NaturalCycles/nodejs-lib/commit/07bc3a9e451a67aca94c8dbebd36cf4427082020))

## [12.2.2](https://github.com/NaturalCycles/nodejs-lib/compare/v12.2.1...v12.2.2) (2020-10-05)


### Bug Fixes

* **slack:** allow to return Promise<null> ([8bbd544](https://github.com/NaturalCycles/nodejs-lib/commit/8bbd544c1713e127f01ce39c66cc881036b31848))

## [12.2.1](https://github.com/NaturalCycles/nodejs-lib/compare/v12.2.0...v12.2.1) (2020-10-05)


### Bug Fixes

* **slack:** improve typing of SlackMessagePrefixHook ([acf3ce1](https://github.com/NaturalCycles/nodejs-lib/commit/acf3ce1f71d404f24a558a6782c71ba19b452e70))

# [12.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.1.0...v12.2.0) (2020-10-05)


### Features

* **slack:** allow messagePrefixHook to skip messages ([098b479](https://github.com/NaturalCycles/nodejs-lib/commit/098b4792da284672d2a3a7ced95cad0a7d5b4ee9))

# [12.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v12.0.0...v12.1.0) (2020-09-21)


### Features

* bufferReviver ([ba8eeea](https://github.com/NaturalCycles/nodejs-lib/commit/ba8eeea9998cdfcfa37a45f6cf4fea497c79bdce))

# [12.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v11.2.1...v12.0.0) (2020-09-21)


### Features

* don't coerce null values to undefined/empty in Joi validation ([ef1d154](https://github.com/NaturalCycles/nodejs-lib/commit/ef1d1540beb1e281108e704c5f928a2d3761fae6))


### BREAKING CHANGES

* ^^^
null values stay as null values now
They become INVALID in most of the places, unless explicitly allowed

Purpose of this change is to allow APIs to send null values to explicitly indicate
 "absense of value".

Example: a patch API that wants to "unset"/delete a value. It now can send { someProp: null } to
indicate that backend have to "delete" this proporty. Previously null value would be stripped and
 input become { } (empty object).

## [11.2.1](https://github.com/NaturalCycles/nodejs-lib/compare/v11.2.0...v11.2.1) (2020-09-09)


### Bug Fixes

* deps ([346cffe](https://github.com/NaturalCycles/nodejs-lib/commit/346cffe7e9828fe6d9c1fefd091b4038161d4f03))

# [11.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v11.1.3...v11.2.0) (2020-09-02)


### Features

* booleanDefaultToFalseSchema ([97a9dba](https://github.com/NaturalCycles/nodejs-lib/commit/97a9dba572baea4d18a91f99876bca4f7d0d94bb))
* export ValidationErrorItem ([0d4433b](https://github.com/NaturalCycles/nodejs-lib/commit/0d4433bafd8b70f11b926cb1978e1b1c83b1e365))

## [11.1.3](https://github.com/NaturalCycles/nodejs-lib/compare/v11.1.2...v11.1.3) (2020-08-20)


### Bug Fixes

* export AnySchema from 'joi' ([aacef16](https://github.com/NaturalCycles/nodejs-lib/commit/aacef16e39ba550f7d5e597ede7ceb2aeb84f34b))

## [11.1.2](https://github.com/NaturalCycles/nodejs-lib/compare/v11.1.1...v11.1.2) (2020-08-20)


### Bug Fixes

* replace @hapi/joi with joi ([e48c62f](https://github.com/NaturalCycles/nodejs-lib/commit/e48c62fff9e796906580dde138a23fec9466a8ec))

## [11.1.1](https://github.com/NaturalCycles/nodejs-lib/compare/v11.1.0...v11.1.1) (2020-08-17)


### Bug Fixes

* deps ([ea4c447](https://github.com/NaturalCycles/nodejs-lib/commit/ea4c4471149483c412b0095e7cbaa01ca68d91b9))

# [11.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v11.0.2...v11.1.0) (2020-08-10)


### Features

* _chunkBuffer, _packJsonField, _unpackJsonField ([9fc2336](https://github.com/NaturalCycles/nodejs-lib/commit/9fc233666d5e6324b8148a63d61ec5b5f8b2d400))

## [11.0.2](https://github.com/NaturalCycles/nodejs-lib/compare/v11.0.1...v11.0.2) (2020-08-10)


### Bug Fixes

* short version of slackService.send(string, ctx?: CTX) ([602346b](https://github.com/NaturalCycles/nodejs-lib/commit/602346bf61db021c3e5052a12a07084aacfaf0b0))

## [11.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v11.0.0...v11.0.1) (2020-08-10)


### Bug Fixes

* allow SlackMessagePrefixHook to be async ([031d19d](https://github.com/NaturalCycles/nodejs-lib/commit/031d19d00f92107ac63c9f20785468dfef65f58f))

# [11.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.8.0...v11.0.0) (2020-08-10)


### Features

* refactor/refine the api of SlackService ([a67a525](https://github.com/NaturalCycles/nodejs-lib/commit/a67a5256162319b054f35fd43832560054bbf9c3))


### BREAKING CHANGES

* ^^^

# [10.8.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.7.0...v10.8.0) (2020-08-10)


### Features

* remove csv features/deps from this lib ([10c735e](https://github.com/NaturalCycles/nodejs-lib/commit/10c735e2252a6170575f604869430e66784720a2))

# [10.7.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.6.2...v10.7.0) (2020-08-04)


### Features

* transformLogProgress to log "final" with "extra" ([af75f1a](https://github.com/NaturalCycles/nodejs-lib/commit/af75f1a24695d7fa60b2916e7102a720a8f90152))

## [10.6.2](https://github.com/NaturalCycles/nodejs-lib/compare/v10.6.1...v10.6.2) (2020-07-13)


### Bug Fixes

* deps ([51faa60](https://github.com/NaturalCycles/nodejs-lib/commit/51faa60f315295e89dcc8fa79b9292afd39cb0de))

## [10.6.1](https://github.com/NaturalCycles/nodejs-lib/compare/v10.6.0...v10.6.1) (2020-07-07)


### Bug Fixes

* deps ([608963a](https://github.com/NaturalCycles/nodejs-lib/commit/608963aa949cbc6691c16bd8c8ced0a553e5b688))

# [10.6.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.5.0...v10.6.0) (2020-06-22)


### Features

* TransformMapOptions.onError to pass input as 2nd argument ([5d6983b](https://github.com/NaturalCycles/nodejs-lib/commit/5d6983b6f7d8827c2dddc6e5a86c5c7ee49ca0f2))

# [10.5.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.4.3...v10.5.0) (2020-06-01)


### Features

* GetGotOptions.logWithPrefixUrl, logWithSearchParams ([62b8b90](https://github.com/NaturalCycles/nodejs-lib/commit/62b8b90b79174bcd93cbd9b094234fd915790ab3))

## [10.4.3](https://github.com/NaturalCycles/nodejs-lib/compare/v10.4.2...v10.4.3) (2020-05-17)


### Bug Fixes

* GetGotOptions now extend got.Options ([285a89e](https://github.com/NaturalCycles/nodejs-lib/commit/285a89e3d449858b0fb2153292888e17466ce865))

## [10.4.2](https://github.com/NaturalCycles/nodejs-lib/compare/v10.4.1...v10.4.2) (2020-05-11)


### Bug Fixes

* deps ([c682edc](https://github.com/NaturalCycles/nodejs-lib/commit/c682edce3a3896fbc9eb2401a971727115abea98))

## [10.4.1](https://github.com/NaturalCycles/nodejs-lib/compare/v10.4.0...v10.4.1) (2020-05-11)


### Bug Fixes

* deps, export Got type ([fc29a2c](https://github.com/NaturalCycles/nodejs-lib/commit/fc29a2c96382ac73a31b1f18e7956b4c1e4d6b09))

# [10.4.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.3.0...v10.4.0) (2020-05-06)


### Bug Fixes

* **slack:** responseType=text (as it should be) ([bbfc1b6](https://github.com/NaturalCycles/nodejs-lib/commit/bbfc1b69adb38a0faf0fb7748b908ccdde66f81f))
* deps ([bd04cc9](https://github.com/NaturalCycles/nodejs-lib/commit/bd04cc99919abb4b378b60b5afa493d8d21c0d6a))


### Features

* **slack:** special treatment of arrays, .log(...things: any[]) ([7f4fb5d](https://github.com/NaturalCycles/nodejs-lib/commit/7f4fb5dbe1a8a9e5edf7390eab8fb89fa6cfa881))

# [10.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.2.1...v10.3.0) (2020-04-28)


### Features

* ndjson-map limitInput/output logEveryInput/output ([5bd4c02](https://github.com/NaturalCycles/nodejs-lib/commit/5bd4c02bd0c123d752efe26895da859726c99fee))

## [10.2.1](https://github.com/NaturalCycles/nodejs-lib/compare/v10.2.0...v10.2.1) (2020-04-22)


### Bug Fixes

* deps ([d586670](https://github.com/NaturalCycles/nodejs-lib/commit/d5866708f17d73f5f4dff5364c6c6e20fea22d07))

# [10.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.1.1...v10.2.0) (2020-04-21)


### Features

* RunScriptOptions ([60d59d1](https://github.com/NaturalCycles/nodejs-lib/commit/60d59d1ee9c0bc30b1ae0c07ea9f29372fe83c49))

## [10.1.1](https://github.com/NaturalCycles/nodejs-lib/compare/v10.1.0...v10.1.1) (2020-04-20)


### Bug Fixes

* deps, got@11 (under test) ([d83f615](https://github.com/NaturalCycles/nodejs-lib/commit/d83f6152b04acdab32fe532f32b8a0607e800e22))

# [10.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v10.0.1...v10.1.0) (2020-04-19)


### Features

* secrets-decrypt, secrets-encrypt, s-gen-key ([f3f34d9](https://github.com/NaturalCycles/nodejs-lib/commit/f3f34d93197f38295dfe628ffaa51dcbcf6d1da0))

## [10.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v10.0.0...v10.0.1) (2020-04-19)


### Bug Fixes

* adopt js-lib@12 ([ffe8396](https://github.com/NaturalCycles/nodejs-lib/commit/ffe8396bc18fd057acbf6050d4237da65f038f2c))
* slack send method to accept `any` ([2103862](https://github.com/NaturalCycles/nodejs-lib/commit/21038626730aa03f460aa8869c87be2a879fa049))

# [10.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v9.1.4...v10.0.0) (2020-04-13)


### Features

* kb, mb, hb moved away to js-lib ([04936a6](https://github.com/NaturalCycles/nodejs-lib/commit/04936a6ad4f094cdfcd8542627ac65f5286e3e76))


### BREAKING CHANGES

* ^^^

## [9.1.4](https://github.com/NaturalCycles/nodejs-lib/compare/v9.1.3...v9.1.4) (2020-04-13)


### Bug Fixes

* deps ([387e912](https://github.com/NaturalCycles/nodejs-lib/commit/387e9124adebce5a8b611637a4d96ca3bdbd9cf6))

## [9.1.3](https://github.com/NaturalCycles/nodejs-lib/compare/v9.1.2...v9.1.3) (2020-04-02)


### Bug Fixes

* chalk@4 ([7df3202](https://github.com/NaturalCycles/nodejs-lib/commit/7df32028704fb02c3cb473b073e60f02293a074f))

## [9.1.2](https://github.com/NaturalCycles/nodejs-lib/compare/v9.1.1...v9.1.2) (2020-03-31)


### Bug Fixes

* got error formatting ([72f314c](https://github.com/NaturalCycles/nodejs-lib/commit/72f314ce1b6a8de6777466bca6db38ca0f62c9bf))

## [9.1.1](https://github.com/NaturalCycles/nodejs-lib/compare/v9.1.0...v9.1.1) (2020-03-31)


### Bug Fixes

* deps ([260da5e](https://github.com/NaturalCycles/nodejs-lib/commit/260da5ef57540eb3b85d43f2cb2cb114dfefea1e))

# [9.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v9.0.0...v9.1.0) (2020-03-31)


### Features

* export runScript separately as /script ([5284983](https://github.com/NaturalCycles/nodejs-lib/commit/528498355ee9b94774f52b0da96466f763b0001b))

# [9.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.7.0...v9.0.0) (2020-03-31)


### Features

* export /exec, /colors separately ([10ecb00](https://github.com/NaturalCycles/nodejs-lib/commit/10ecb00d8558ddb5a97e16801c6ba96fa6d9d652))


### BREAKING CHANGES

* ^^^

# [8.7.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.6.0...v8.7.0) (2020-03-31)


### Features

* remove rxjs ([be05392](https://github.com/NaturalCycles/nodejs-lib/commit/be0539296b21af40fbdd2e9dce9271b6cfd89868))

# [8.6.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.5.0...v8.6.0) (2020-03-27)


### Features

* bump to nanoid@3 ([0c89107](https://github.com/NaturalCycles/nodejs-lib/commit/0c89107e70b00a6b3b4ecff7a717a3daecf795af))

# [8.5.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.4.0...v8.5.0) (2020-03-26)


### Features

* slack-this allow to override hook via --webhook ([6964688](https://github.com/NaturalCycles/nodejs-lib/commit/6964688a170baffab8f4b40e0f5722de3a87cc40))

# [8.4.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.3.0...v8.4.0) (2020-03-26)


### Features

* runScript slackOnSuccess ([0f31df1](https://github.com/NaturalCycles/nodejs-lib/commit/0f31df1e7c2b54062918ec672774f9bc468a0928))

# [8.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.2.0...v8.3.0) (2020-03-25)


### Bug Fixes

* joi no colors if !!process.env.GAE ([5160300](https://github.com/NaturalCycles/nodejs-lib/commit/5160300c73041086404bd885b5d618ac144cb9c2))


### Features

* runScript with env.SLACK_ON_FAILURE ([b52fb06](https://github.com/NaturalCycles/nodejs-lib/commit/b52fb0695de30f7925eda981c190421c58994a2c))
* slack-this CLI ([3803773](https://github.com/NaturalCycles/nodejs-lib/commit/3803773ecabc6c48bbd9c7060cb875225452c484))

# [8.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.1.1...v8.2.0) (2020-03-23)


### Features

* ndjson-map --limit ([8269004](https://github.com/NaturalCycles/nodejs-lib/commit/826900403e009a6d6c367658e9253f44746bb0d5))

## [8.1.1](https://github.com/NaturalCycles/nodejs-lib/compare/v8.1.0...v8.1.1) (2020-03-23)


### Bug Fixes

* ndjson-map zip/unzip ([9374dfd](https://github.com/NaturalCycles/nodejs-lib/commit/9374dfdfdba9831490c52b7d6e53f7282fee9c45))

# [8.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v8.0.1...v8.1.0) (2020-03-23)


### Features

* ndjson-map CLI ([59f985e](https://github.com/NaturalCycles/nodejs-lib/commit/59f985eac843df2a4c187eec3d1a78aad48145f9))
* TransformLogProgress.rssMinusHeap ([44a231d](https://github.com/NaturalCycles/nodejs-lib/commit/44a231db659f6e1ec4c25844fa9850f39059952e))

## [8.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v8.0.0...v8.0.1) (2020-03-22)


### Bug Fixes

* userAgentSchema min ([f73e34b](https://github.com/NaturalCycles/nodejs-lib/commit/f73e34bcf6056683658695d9d2e3d3b55db46923))

# [8.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.27.1...v8.0.0) (2020-03-21)


### Features

* update to joi17 ([#1](https://github.com/NaturalCycles/nodejs-lib/issues/1)) ([550783f](https://github.com/NaturalCycles/nodejs-lib/commit/550783fa307cf0375ee6de6c379bebc06f4fc7e5))


### BREAKING CHANGES

* joi17 is used instead of joi15. It brings a big set of breaking changes by itself (despite the fact that all tests are passing now in this lib).

## [7.27.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.27.0...v7.27.1) (2020-03-21)


### Bug Fixes

* getGot missing opt ([7ad6189](https://github.com/NaturalCycles/nodejs-lib/commit/7ad61891883e6b8cdd2f92fd55875cd14087b1bc))

# [7.27.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.26.1...v7.27.0) (2020-03-21)


### Features

* export more colors ([52b320e](https://github.com/NaturalCycles/nodejs-lib/commit/52b320e1107a69aa6ee1af0614b85ccc0b086f31))
* getGot() with useful default hooks ([0912157](https://github.com/NaturalCycles/nodejs-lib/commit/09121579f40e497b300a2f984855ad0adb893a92))
* inspectIfPossible() ([8651859](https://github.com/NaturalCycles/nodejs-lib/commit/865185996bba70d51bcff46c97f43b21975a8401))

## [7.26.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.26.0...v7.26.1) (2020-03-19)


### Bug Fixes

* deps ([1097b6b](https://github.com/NaturalCycles/nodejs-lib/commit/1097b6be80e8b1a360d6eb1b84e26a3485cfeaf8))

# [7.26.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.25.0...v7.26.0) (2020-03-18)


### Features

* TableDiffOptions.aTitle, bTitle ([b2a7392](https://github.com/NaturalCycles/nodejs-lib/commit/b2a7392e6c64e1ba700300a4b474bc5182bec049))

# [7.25.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.24.0...v7.25.0) (2020-03-18)


### Features

* tableDiff ([783130b](https://github.com/NaturalCycles/nodejs-lib/commit/783130b2b70db9f7ebc31b0369694d8959b0a254))

# [7.24.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.23.1...v7.24.0) (2020-03-18)


### Features

* logProgress allow to log external and arrayBuffers ([e366e77](https://github.com/NaturalCycles/nodejs-lib/commit/e366e7751a3e28ac44686594104f9524c221d9a6))

## [7.23.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.23.0...v7.23.1) (2020-03-16)


### Bug Fixes

* bump js-lib ([0893401](https://github.com/NaturalCycles/nodejs-lib/commit/0893401d2d24a5cda7bd867dc9878b578972a7ba))

# [7.23.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.22.1...v7.23.0) (2020-03-09)


### Bug Fixes

* avoid NaN ([fcda77d](https://github.com/NaturalCycles/nodejs-lib/commit/fcda77de4477acd1fedcbee901b9835463c9c91d))


### Features

* transformLogProcess to log ~xK/hour ([1eb75c6](https://github.com/NaturalCycles/nodejs-lib/commit/1eb75c6a3a7e90171606c1d817bdbfa3fc518295))

## [7.22.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.22.0...v7.22.1) (2020-03-01)


### Bug Fixes

* export ExecaOptions ([3e05163](https://github.com/NaturalCycles/nodejs-lib/commit/3e051632d3b66ae2a1ca7edc7cc8148d22ba19a7))

# [7.22.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.21.3...v7.22.0) (2020-03-01)


### Features

* deps ([277cea1](https://github.com/NaturalCycles/nodejs-lib/commit/277cea162e56450dda14ba48c37b9e5698e42fe7))

## [7.21.3](https://github.com/NaturalCycles/nodejs-lib/compare/v7.21.2...v7.21.3) (2020-02-25)


### Bug Fixes

* execUtil to print more compact error (shortMessage) ([ffea744](https://github.com/NaturalCycles/nodejs-lib/commit/ffea744dac2f708b56191e10006c759d76ea606c))

## [7.21.2](https://github.com/NaturalCycles/nodejs-lib/compare/v7.21.1...v7.21.2) (2020-02-24)


### Bug Fixes

* export JoiValidationErrorData ([3020a47](https://github.com/NaturalCycles/nodejs-lib/commit/3020a47b9540982014fb41f83aeb01de5bd16559))

## [7.21.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.21.0...v7.21.1) (2020-02-11)


### Bug Fixes

* worker error handling ([287fa4e](https://github.com/NaturalCycles/nodejs-lib/commit/287fa4e41598fb45971fb6358734f688685e8b1f))

# [7.21.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.20.3...v7.21.0) (2020-02-11)


### Features

* catch errors from workers, log them ([66810d1](https://github.com/NaturalCycles/nodejs-lib/commit/66810d1e46b638c3520c7010cea79e0e3364956f))
* export more colors ([7d0d05e](https://github.com/NaturalCycles/nodejs-lib/commit/7d0d05e5c7a542e6947b6d3063f4e5c3c671b311))
* transformLogProgress to log intermediate results ([6b2a68b](https://github.com/NaturalCycles/nodejs-lib/commit/6b2a68ba5fe2f611e072384ef0bd71ffaa2e8cc7))
* transformLogProgress will log rss by default ([35ebd60](https://github.com/NaturalCycles/nodejs-lib/commit/35ebd603e11c1dcc06b15b905fd5c6b40850de43))
* workers to log progress ([136f8e8](https://github.com/NaturalCycles/nodejs-lib/commit/136f8e856cb0b599b887769208f37399a56c1e99))

## [7.20.3](https://github.com/NaturalCycles/nodejs-lib/compare/v7.20.2...v7.20.3) (2020-02-10)


### Bug Fixes

* TransformMultiThreadedOptions.highWaterMark ([a029f65](https://github.com/NaturalCycles/nodejs-lib/commit/a029f652f92ae5325a417b973ab3228f30940f95))

## [7.20.2](https://github.com/NaturalCycles/nodejs-lib/compare/v7.20.1...v7.20.2) (2020-02-10)


### Bug Fixes

* TransformMultiThreadedOptions.concurrency ([91cda47](https://github.com/NaturalCycles/nodejs-lib/commit/91cda479eda923e24f25f762bae3ba142e926086))

## [7.20.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.20.0...v7.20.1) (2020-02-10)


### Bug Fixes

* simplify WorkerClass interface ([19a5627](https://github.com/NaturalCycles/nodejs-lib/commit/19a56278e2eedb66ecd14b44b41db7f54eb32501))

# [7.20.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.19.0...v7.20.0) (2020-02-10)


### Features

* improve multiThreadedWorker interface ([b4ceb62](https://github.com/NaturalCycles/nodejs-lib/commit/b4ceb62af0ea28125e620dc21040547d10942560))
* transformMultiThreaded with backpressure and concurrency ([d74cbb5](https://github.com/NaturalCycles/nodejs-lib/commit/d74cbb59a0df7fb623ada51a8d1d43f1bf77a61d))

# [7.19.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.18.1...v7.19.0) (2020-02-07)


### Features

* transformMultiThreaded (experimental) ([dcca436](https://github.com/NaturalCycles/nodejs-lib/commit/dcca436cfbc8f5e6faa42d4987d9e5e6fd896ed5))

## [7.18.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.18.0...v7.18.1) (2020-01-31)


### Bug Fixes

* exec to log error properly ([f11d93c](https://github.com/NaturalCycles/nodejs-lib/commit/f11d93ca2a577ff7b829cc2a4791d7b340729511))

# [7.18.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.17.0...v7.18.0) (2020-01-28)


### Features

* flattenArrayOutput TransformMap option ([3fd777c](https://github.com/NaturalCycles/nodejs-lib/commit/3fd777cbe01e495130139b1bc82ac4b5296903cc))

# [7.17.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.16.0...v7.17.0) (2020-01-27)


### Features

* support transformMap to return [] and emit multiple results ([3feaf4b](https://github.com/NaturalCycles/nodejs-lib/commit/3feaf4b5b67ed5d14413a228a67faf15796cce79))

# [7.16.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.15.0...v7.16.0) (2020-01-20)


### Features

* csvParse, csvStringify, transformToCSV ([501bde0](https://github.com/NaturalCycles/nodejs-lib/commit/501bde0c7250bdb92863be06465d49610b294dbb))

# [7.15.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.14.1...v7.15.0) (2020-01-14)


### Features

* writableFork, readableCreate ([0cfca98](https://github.com/NaturalCycles/nodejs-lib/commit/0cfca98561cba2a72bcd3f54455fd97980342c53))

## [7.14.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.14.0...v7.14.1) (2019-12-30)


### Bug Fixes

* export transformThrough ([73c5b42](https://github.com/NaturalCycles/nodejs-lib/commit/73c5b42211c57f0465430d8a090ceb11b283dcce))

# [7.14.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.13.0...v7.14.0) (2019-12-08)


### Features

* got@10 ([ac80a33](https://github.com/NaturalCycles/nodejs-lib/commit/ac80a339a3524a8a825d2a53f841ead55c87a039))
* transformLogProgress extra() ([cb54e8c](https://github.com/NaturalCycles/nodejs-lib/commit/cb54e8cd371c06a1b535ead343114c342b10e67b))

# [7.13.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.12.1...v7.13.0) (2019-12-05)


### Features

* requireFileToExist() ([2829814](https://github.com/NaturalCycles/nodejs-lib/commit/28298143e501bb880aa4cf1f24a989a05a35b289))

## [7.12.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.12.0...v7.12.1) (2019-12-05)


### Bug Fixes

* trying it fix circ dep in execUtil/colors ([da26fd5](https://github.com/NaturalCycles/nodejs-lib/commit/da26fd535fafd9b65c079c06ba87bcf9476c0bce))

# [7.12.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.11.3...v7.12.0) (2019-12-03)


### Bug Fixes

* chalk export ([87a05c2](https://github.com/NaturalCycles/nodejs-lib/commit/87a05c2c29ea9a0864ca845cccaba9abd6403887))


### Features

* gzip/gunzip in addition to zip/unzip ([d9fde2b](https://github.com/NaturalCycles/nodejs-lib/commit/d9fde2b1435186f6687c1cbcf4bbd2336b226ce7))
* update and export chalk ([3c71613](https://github.com/NaturalCycles/nodejs-lib/commit/3c71613ee7705f4edc7949e6000a5eef98f5174a))

## [7.11.3](https://github.com/NaturalCycles/nodejs-lib/compare/v7.11.2...v7.11.3) (2019-11-08)


### Bug Fixes

* better stream error handling/logging ([d506386](https://github.com/NaturalCycles/nodejs-lib/commit/d50638662daa5c53ab22f8903ce167c677eaf311))

## [7.11.2](https://github.com/NaturalCycles/nodejs-lib/compare/v7.11.1...v7.11.2) (2019-11-08)


### Bug Fixes

* transformMap to log errors by default ([edafdb2](https://github.com/NaturalCycles/nodejs-lib/commit/edafdb2f25a9ad8ae57fb581ef3fff0cacde227e))

## [7.11.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.11.0...v7.11.1) (2019-11-07)


### Bug Fixes

* force forEach mapper to return void ([53716f0](https://github.com/NaturalCycles/nodejs-lib/commit/53716f0c4fab2da853161f29c26cbd4171c8c1f5))

# [7.11.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.10.0...v7.11.0) (2019-11-06)


### Features

* transformLimit ([24a757d](https://github.com/NaturalCycles/nodejs-lib/commit/24a757d47b43c08febf0cb866032cc4ed178f274))

# [7.10.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.9.2...v7.10.0) (2019-11-05)


### Features

* runScript with uncaughtException logger and memoryInterval ([ce4bfd6](https://github.com/NaturalCycles/nodejs-lib/commit/ce4bfd68cc39f62650beda44006bc83230c0b652))

## [7.9.2](https://github.com/NaturalCycles/nodejs-lib/compare/v7.9.1...v7.9.2) (2019-11-04)


### Bug Fixes

* export TransformLogProgressOptions ([7a44578](https://github.com/NaturalCycles/nodejs-lib/commit/7a4457814bebf7fc62c34310c546ed143e356045))

## [7.9.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.9.0...v7.9.1) (2019-11-04)


### Bug Fixes

* hopefully fix typings error ([e7b8a57](https://github.com/NaturalCycles/nodejs-lib/commit/e7b8a5740561eec4f536f2d18b7b6426b521c433))

# [7.9.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.8.0...v7.9.0) (2019-11-04)


### Features

* transformLogProgress logRPS option ([3be8952](https://github.com/NaturalCycles/nodejs-lib/commit/3be8952808371dd8c540ad1d9aee3215ab6067bf))

# [7.8.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.7.0...v7.8.0) (2019-11-04)


### Features

* remove progress logging from transformMap ([9e8eafd](https://github.com/NaturalCycles/nodejs-lib/commit/9e8eafd7ebb7fc4e3e0e9bb9bbe273cb70e2b63a))

# [7.7.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.6.1...v7.7.0) (2019-11-04)


### Features

* remove logProgressInterval, logProgressCount > logEvery ([108b32f](https://github.com/NaturalCycles/nodejs-lib/commit/108b32f39c4925455e69f1a6d506d77ee4025c13))

## [7.6.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.6.0...v7.6.1) (2019-11-03)


### Bug Fixes

* NDJson allow empty creation ([7448f1a](https://github.com/NaturalCycles/nodejs-lib/commit/7448f1a948fbe4d422520e41a644a16738243bad))

# [7.6.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.5.0...v7.6.0) (2019-11-03)


### Features

* NDJsonStats and better logging/stats ([864293b](https://github.com/NaturalCycles/nodejs-lib/commit/864293b0902a1ced9a7b003311e94b37f60429dc))

# [7.5.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.4.0...v7.5.0) (2019-11-03)


### Features

* export color shortcut functions ([7d5b53b](https://github.com/NaturalCycles/nodejs-lib/commit/7d5b53bac897f25b83b8248bbfe22c9541cb381c))
* NDJson pipeline log stats ([f9b2abf](https://github.com/NaturalCycles/nodejs-lib/commit/f9b2abf6a3c406752ab85988f979c762c3bb0122))

# [7.4.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.3.0...v7.4.0) (2019-11-03)


### Features

* hb, kb ([21b7d00](https://github.com/NaturalCycles/nodejs-lib/commit/21b7d007e18ee8f90f91edecbfee425190649299))

# [7.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.2.0...v7.3.0) (2019-11-03)


### Features

* writableVoid, some transforms > writables ([5d1cb60](https://github.com/NaturalCycles/nodejs-lib/commit/5d1cb60bb683a4d8f987f6359883cd23ebd1c431))

# [7.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.1.1...v7.2.0) (2019-11-03)


### Features

* transformForEach ([f162bba](https://github.com/NaturalCycles/nodejs-lib/commit/f162bbafa819177df883f52581546fcfe31f7401))

## [7.1.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.1.0...v7.1.1) (2019-11-02)


### Bug Fixes

* streamMapToArray mapper defaults to passthrough ([ca3eebc](https://github.com/NaturalCycles/nodejs-lib/commit/ca3eebc921670710a7823a4e2cd7f05978f103dd))

# [7.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v7.0.1...v7.1.0) (2019-11-02)


### Features

* transformTap ([ba73162](https://github.com/NaturalCycles/nodejs-lib/commit/ba731628f4448155ab310f8fb30b73301221fd13))

## [7.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v7.0.0...v7.0.1) (2019-11-02)


### Bug Fixes

* streamToString>streamJoinToString, streamMap>streamMapToArray ([02bdd73](https://github.com/NaturalCycles/nodejs-lib/commit/02bdd738820209090f204787d5b92bc14349fdb5))

# [7.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.34.0...v7.0.0) (2019-11-02)


### Features

* new set of Stream functions ([e543f77](https://github.com/NaturalCycles/nodejs-lib/commit/e543f778ddae752e95f87927bd2f07a900db32ad))


### BREAKING CHANGES

* ^^^

# [6.34.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.33.0...v6.34.0) (2019-11-02)


### Features

* streamBuffer(), _through ([9214fde](https://github.com/NaturalCycles/nodejs-lib/commit/9214fde2ffbcbd5fdda737a859df40067d659da6))

# [6.33.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.32.0...v6.33.0) (2019-11-02)


### Features

* toNDJsonStringTransform, streamToString, _pipeline ([3716898](https://github.com/NaturalCycles/nodejs-lib/commit/37168985ce5cc00e84b5fb51918d59437c4221ef))

# [6.32.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.31.0...v6.32.0) (2019-11-02)


### Features

* TransformTyped<IN, OUT> ([e787a81](https://github.com/NaturalCycles/nodejs-lib/commit/e787a81839f07572cbf27a2db30abd90a8658a6c))

# [6.31.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.30.1...v6.31.0) (2019-10-31)


### Features

* WritableTyped, TransformTyped ([e47c694](https://github.com/NaturalCycles/nodejs-lib/commit/e47c6948ffe87d657d24af4c1a322f6b5aa510a8))

## [6.30.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.30.0...v6.30.1) (2019-10-30)


### Bug Fixes

* remove @types/dotenv ([7540196](https://github.com/NaturalCycles/nodejs-lib/commit/7540196eb2688ff15f84d7ea9eba51cec44ff68a))

# [6.30.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.29.1...v6.30.0) (2019-10-30)


### Features

* **joi:** truncate after 1000, not 500 chars ([379b775](https://github.com/NaturalCycles/nodejs-lib/commit/379b775c85472dfd8cc32b2f6005a8000e3d3999))

## [6.29.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.29.0...v6.29.1) (2019-10-23)


### Bug Fixes

* joi validation error truncated at 500 (not 5000) chars ([cd6ef4f](https://github.com/NaturalCycles/nodejs-lib/commit/cd6ef4f00eaae60001369886e3a8144377e23d5c))

# [6.29.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.28.1...v6.29.0) (2019-10-20)


### Features

* StreamToObservableOptions.logProgress ([283be58](https://github.com/NaturalCycles/nodejs-lib/commit/283be58))

## [6.28.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.28.0...v6.28.1) (2019-10-20)


### Bug Fixes

* exports ([2a36f01](https://github.com/NaturalCycles/nodejs-lib/commit/2a36f01))

# [6.28.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.27.0...v6.28.0) (2019-10-20)


### Features

* ReadableTyped<T> ([1796ebb](https://github.com/NaturalCycles/nodejs-lib/commit/1796ebb))

# [6.27.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.26.0...v6.27.0) (2019-10-20)


### Bug Fixes

* improve typing of streamToArray ([8e5cb01](https://github.com/NaturalCycles/nodejs-lib/commit/8e5cb01))


### Features

* streamMap, that returns `Promise<void>` ([f893e7e](https://github.com/NaturalCycles/nodejs-lib/commit/f893e7e))

# [6.26.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.25.0...v6.26.0) (2019-10-20)


### Features

* streamMap>streamToObservable ([c9511a3](https://github.com/NaturalCycles/nodejs-lib/commit/c9511a3))

# [6.25.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.24.2...v6.25.0) (2019-10-19)


### Features

* streamMap skipErrors option ([55bbc21](https://github.com/NaturalCycles/nodejs-lib/commit/55bbc21))

## [6.24.2](https://github.com/NaturalCycles/nodejs-lib/compare/v6.24.1...v6.24.2) (2019-10-19)


### Bug Fixes

* use Readable instead of ReadableStream ([38baf4a](https://github.com/NaturalCycles/nodejs-lib/commit/38baf4a))

## [6.24.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.24.0...v6.24.1) (2019-10-19)


### Bug Fixes

* don't throw unhandled error from streamMap ([dc372df](https://github.com/NaturalCycles/nodejs-lib/commit/dc372df))

# [6.24.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.23.1...v6.24.0) (2019-10-19)


### Features

* pMapStream>streamMap, implement stopOnError ([948514a](https://github.com/NaturalCycles/nodejs-lib/commit/948514a))

## [6.23.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.23.0...v6.23.1) (2019-10-18)


### Bug Fixes

* export PMapStreamMapper ([f7e5a33](https://github.com/NaturalCycles/nodejs-lib/commit/f7e5a33))

# [6.23.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.22.0...v6.23.0) (2019-10-18)


### Features

* streamToArray, readableFrom, pMap collectResults ([2fa6e88](https://github.com/NaturalCycles/nodejs-lib/commit/2fa6e88))

# [6.22.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.21.3...v6.22.0) (2019-10-18)


### Features

* pMapStream, StreamToObservableOptions ([7b7dd1d](https://github.com/NaturalCycles/nodejs-lib/commit/7b7dd1d))

## [6.21.3](https://github.com/NaturalCycles/nodejs-lib/compare/v6.21.2...v6.21.3) (2019-10-17)


### Bug Fixes

* bring back execShell ([4b0813e](https://github.com/NaturalCycles/nodejs-lib/commit/4b0813e))

## [6.21.2](https://github.com/NaturalCycles/nodejs-lib/compare/v6.21.1...v6.21.2) (2019-10-16)


### Bug Fixes

* bump deps, should fix execa/joi issues ([ef13b3b](https://github.com/NaturalCycles/nodejs-lib/commit/ef13b3b))

## [6.21.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.21.0...v6.21.1) (2019-10-16)


### Bug Fixes

* execWithArgs, execCommand, preferLocal=false ([f595bf8](https://github.com/NaturalCycles/nodejs-lib/commit/f595bf8))

# [6.21.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.20.0...v6.21.0) (2019-10-14)


### Features

* update execa ([28e47ab](https://github.com/NaturalCycles/nodejs-lib/commit/28e47ab))

# [6.20.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.19.1...v6.20.0) (2019-10-03)


### Features

* execCommand, execShell (move from dev-lib here) ([f87c80c](https://github.com/NaturalCycles/nodejs-lib/commit/f87c80c))
* SlackSharedService ([f31856c](https://github.com/NaturalCycles/nodejs-lib/commit/f31856c))

## [6.19.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.19.0...v6.19.1) (2019-09-25)


### Bug Fixes

* let Debug to bind to console.log later ([7533e2b](https://github.com/NaturalCycles/nodejs-lib/commit/7533e2b))

# [6.19.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.18.1...v6.19.0) (2019-09-24)


### Features

* stringIdAsync, stringIdUnsafe, export nanoid ([7e66202](https://github.com/NaturalCycles/nodejs-lib/commit/7e66202))

## [6.18.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.18.0...v6.18.1) (2019-09-21)


### Bug Fixes

* changed default emailSchema behavior to DO tlds ([50751b2](https://github.com/NaturalCycles/nodejs-lib/commit/50751b2))

# [6.18.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.17.2...v6.18.0) (2019-09-20)


### Features

* export memoryUsage, memoryUsageFull ([edab56e](https://github.com/NaturalCycles/nodejs-lib/commit/edab56e))

## [6.17.2](https://github.com/NaturalCycles/nodejs-lib/compare/v6.17.1...v6.17.2) (2019-09-10)


### Bug Fixes

* emailSchema to only do basic validation (no tld) ([e6ca0a9](https://github.com/NaturalCycles/nodejs-lib/commit/e6ca0a9))

## [6.17.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.17.0...v6.17.1) (2019-08-27)


### Bug Fixes

* secretOptional json support ([c8f12a0](https://github.com/NaturalCycles/nodejs-lib/commit/c8f12a0))

# [6.17.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.16.2...v6.17.0) (2019-08-25)


### Features

* log.debug level ([9a41b15](https://github.com/NaturalCycles/nodejs-lib/commit/9a41b15))

## [6.16.2](https://github.com/NaturalCycles/nodejs-lib/compare/v6.16.1...v6.16.2) (2019-08-24)


### Bug Fixes

* log secret object keys (not values) ([fa4e730](https://github.com/NaturalCycles/nodejs-lib/commit/fa4e730))

## [6.16.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.16.0...v6.16.1) (2019-08-24)


### Bug Fixes

* loadSecretsFromEnv ensures dotenv.config() ([c268005](https://github.com/NaturalCycles/nodejs-lib/commit/c268005))

# [6.16.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.15.1...v6.16.0) (2019-08-24)


### Features

* crypto.util (originally from secret-lib) ([5a44ecb](https://github.com/NaturalCycles/nodejs-lib/commit/5a44ecb))

## [6.15.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.15.0...v6.15.1) (2019-08-24)


### Bug Fixes

* don't lazy-load secrets ([e5d87a6](https://github.com/NaturalCycles/nodejs-lib/commit/e5d87a6))

# [6.15.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.14.0...v6.15.0) (2019-08-24)


### Features

* secret.util ([cb0e4dc](https://github.com/NaturalCycles/nodejs-lib/commit/cb0e4dc))

# [6.14.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.13.0...v6.14.0) (2019-08-24)


### Features

* runScript, requireEnvKeys do 'dotenv/config' ([c20164b](https://github.com/NaturalCycles/nodejs-lib/commit/c20164b))

# [6.13.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.12.0...v6.13.0) (2019-08-20)


### Features

* PausableObservable ([5d40132](https://github.com/NaturalCycles/nodejs-lib/commit/5d40132))

# [6.12.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.11.1...v6.12.0) (2019-08-20)


### Features

* streamToObservable() ([0c80f65](https://github.com/NaturalCycles/nodejs-lib/commit/0c80f65))

## [6.11.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.11.0...v6.11.1) (2019-08-15)


### Bug Fixes

* DebugLogLevel enum ([6989304](https://github.com/NaturalCycles/nodejs-lib/commit/6989304))

# [6.11.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.10.0...v6.11.0) (2019-08-15)


### Features

* log.info() alias to log() ([fa9cd71](https://github.com/NaturalCycles/nodejs-lib/commit/fa9cd71))

# [6.10.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.9.2...v6.10.0) (2019-08-15)


### Features

* log.warn, log.error ([a947833](https://github.com/NaturalCycles/nodejs-lib/commit/a947833))

## [6.9.2](https://github.com/NaturalCycles/nodejs-lib/compare/v6.9.1...v6.9.2) (2019-08-11)


### Bug Fixes

* idSchema to allow '_' ([99bfa59](https://github.com/NaturalCycles/nodejs-lib/commit/99bfa59))

## [6.9.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.9.0...v6.9.1) (2019-08-10)


### Bug Fixes

* Debug bind to console (for colors) ([47ea977](https://github.com/NaturalCycles/nodejs-lib/commit/47ea977))

# [6.9.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.8.0...v6.9.0) (2019-08-10)


### Features

* export Debug ([2986b42](https://github.com/NaturalCycles/nodejs-lib/commit/2986b42))

# [6.8.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.7.0...v6.8.0) (2019-07-21)


### Features

* convert() ([5e99e0d](https://github.com/NaturalCycles/nodejs-lib/commit/5e99e0d))

# [6.7.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.6.0...v6.7.0) (2019-07-16)


### Features

* deps ([e9f09f4](https://github.com/NaturalCycles/nodejs-lib/commit/e9f09f4))

# [6.6.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.5.1...v6.6.0) (2019-07-08)


### Features

* **joi:** isValid, undefinedIfInvalid ([ecea173](https://github.com/NaturalCycles/nodejs-lib/commit/ecea173))

## [6.5.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.5.0...v6.5.1) (2019-06-02)


### Bug Fixes

* types ([faea24b](https://github.com/NaturalCycles/nodejs-lib/commit/faea24b))

# [6.5.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.4.1...v6.5.0) (2019-05-22)


### Features

* urlSchema ([773b9ba](https://github.com/NaturalCycles/nodejs-lib/commit/773b9ba))

## [6.4.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.4.0...v6.4.1) (2019-05-22)


### Bug Fixes

* export more joi models ([f33dff4](https://github.com/NaturalCycles/nodejs-lib/commit/f33dff4))

# [6.4.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.3.1...v6.4.0) (2019-05-20)


### Features

* make @hapi/joi a dependency (not peerDep) ([a060007](https://github.com/NaturalCycles/nodejs-lib/commit/a060007))

## [6.3.1](https://github.com/NaturalCycles/nodejs-lib/compare/v6.3.0...v6.3.1) (2019-05-19)


### Bug Fixes

* objectSchema to allow partial schemas ([2c55a6e](https://github.com/NaturalCycles/nodejs-lib/commit/2c55a6e))

# [6.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.2.0...v6.3.0) (2019-05-19)


### Features

* export alphabets ([905da7e](https://github.com/NaturalCycles/nodejs-lib/commit/905da7e))

# [6.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.1.0...v6.2.0) (2019-05-19)


### Features

* swap luxon to dayjs ([207ffdb](https://github.com/NaturalCycles/nodejs-lib/commit/207ffdb))

# [6.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v6.0.0...v6.1.0) (2019-05-18)


### Features

* joi typings with IN and OUT types ([8ab6ccf](https://github.com/NaturalCycles/nodejs-lib/commit/8ab6ccf))
* stringId(), hashUtil (md5, ...) ([8110084](https://github.com/NaturalCycles/nodejs-lib/commit/8110084))

# [6.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v5.3.0...v6.0.0) (2019-05-18)


### Features

* joi typed schemas ([5145082](https://github.com/NaturalCycles/nodejs-lib/commit/5145082))


### BREAKING CHANGES

* arraySchema is a function now (was: a variable)

# [5.3.0](https://github.com/NaturalCycles/nodejs-lib/compare/v5.2.0...v5.3.0) (2019-05-17)


### Features

* **validation:** allow undefined schema ([192e91b](https://github.com/NaturalCycles/nodejs-lib/commit/192e91b))

# [5.2.0](https://github.com/NaturalCycles/nodejs-lib/compare/v5.1.0...v5.2.0) (2019-05-12)


### Features

* LRUMemoCache (ex-[@memo](https://github.com/memo)Cache in js-lib) ([6da651b](https://github.com/NaturalCycles/nodejs-lib/commit/6da651b))

# [5.1.0](https://github.com/NaturalCycles/nodejs-lib/compare/v5.0.2...v5.1.0) (2019-05-10)


### Features

* requireEnvKeys ([814bc99](https://github.com/NaturalCycles/nodejs-lib/commit/814bc99))

## [5.0.2](https://github.com/NaturalCycles/nodejs-lib/compare/v5.0.1...v5.0.2) (2019-05-03)


### Bug Fixes

* include `luxon` as dependency ([f221f8e](https://github.com/NaturalCycles/nodejs-lib/commit/f221f8e))

## [5.0.1](https://github.com/NaturalCycles/nodejs-lib/compare/v5.0.0...v5.0.1) (2019-04-30)


### Bug Fixes

* publish types ([2e768a2](https://github.com/NaturalCycles/nodejs-lib/commit/2e768a2))

# [5.0.0](https://github.com/NaturalCycles/nodejs-lib/compare/v4.2.0...v5.0.0) (2019-04-30)


### Bug Fixes

* ci ([d2d5f46](https://github.com/NaturalCycles/nodejs-lib/commit/d2d5f46))


### Features

* upgrade joi@14 to @hapi/joi@15 ([68a5802](https://github.com/NaturalCycles/nodejs-lib/commit/68a5802))


### BREAKING CHANGES

* ^^^

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
