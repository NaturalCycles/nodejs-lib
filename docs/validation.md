# Validation

Based on popular [Joi](https://github.com/sideway/joi) validation library.

Assumes that you don't need to have `joi` as your dependency, but just use convenience methods from
`nodejs-lib` (and use exported `Joi`, which is extended with all the extensions and defaults
documented below). Do not import `joi` directly, otherwise you lose these defaults and extensions.

Default options:

- `presense: required` - all declared fields are required by default
- `convert: true`
- `allowUnknown: true`
- `stripUnknown:`
  - `objects: true`
  - `arrays: false`

Extensions:

- Strings are trimmed by default
- Treats empty strings `'''` as empty/undefined
- `dateString` stringSchema extension to validate ISO8601 dates
- `dividable` numberSchema extension to validate divide-ability

Does some processing of the Error thrown:

- Includes `objectName` (if provided), otherwise tries to detect "classname" (doing
  `value?.constructor?.name`).
- Includes `objectId` if it can be detected (`id` field of an object passed). Useful e.g in `db-lib`
  CommonDao methods.
- Truncates error message to 1000 characters.
- Truncates `err.details` to max 5 items

## validate

- Validates with Joi.
- Throws JoiValidationError if invalid.
- Returns _converted_ value.
- If `schema` is undefined - returns value as is.

```ts
validate('abc', stringSchema)
// 'abc' (returns as is)

validate(5, stringSchema)
// '5' (converts to string)

validate({}, stringSchema)
// throws JoiValidationError
```

## convert

Does Joi-conversion, regardless of error/validity of value. Invalid values return `undefined`.

```ts
convert(5, stringSchema)
// '5' (valid, converted)

convert({}, stringSchema)
// undefined (invalid, does not throw)
```

## getValidationResult

- Validates with Joi.
- Returns `JoiValidationResult` with converted value and error (if any).
- Does not throw.

If `schema` is undefined - returns value as is.

```ts
getValidationResult('5', stringSchema)
// { value: '5', error: undefined }

getValidationResult({}, stringSchema)
// { error: ..., value: undefined }
```

## isValid

- Validates the value and returns `boolean`.
- Does not throw.
- Converted valid values are still considered valid.

```ts
isValid('5', stringSchema) // true
isValid(5, stringSchema) // still true, cause it can be converted to '5'
```

## undefinedIfInvalid

- Validates the value.
- Valid value is returned as is.
- Invalid value is returned as `undefined` without throwing an error.

```ts
undefinedIfInvalid('5', stringSchema)
// '5' as is, because it's valid

undefinedIfInvalid({}, stringSchema)
// undefined, because value is invalid
```

## JoiValidationResult

```ts
interface JoiValidationResult<T = any> {
  value: T
  error?: JoiValidationError
}
```

TODO: can be replaced by a Tuple of `[error, value]` in the future.

## JoiValidationError

```ts
import { ValidationErrorItem } from 'joi'

interface JoiValidationErrorData extends ErrorData {
  joiValidationErrorItems: ValidationErrorItem[]
  joiValidationObjectName?: string
  joiValidationObjectId?: string
}
```

## dateString

```ts
interface SomeObject {
  date: string // e.g `2021-06-21`
}

const schema = objectSchema<SomeObject>({
  date: stringSchema.dateString(),
  // same as:
  // date: dateStringSchema,
})
```

Options:

- `min`
- `max`

## dividable

Book example - number schema extension to test divide-ability.

```ts
const schema = numberSchema.dividable(15)
```

## Common validation schemas

Most of these are just conveniently defined/exported schemas, so you don't have to import `Joi`
object.

They are also conveniently typed, so validation functions can automatically defer the output type
based on these schemas (unlike default Joi typings that don't support "typed schemas" at all ATM).

- `booleanSchema`
- `stringSchema`
- `numberSchema`
- `integerSchema`
- `percentageSchema` - integer from 0 to 100 included
- `dateStringSchema`
- `binarySchema`
- `urlSchema` - defaults to require `https` protocol
- `arraySchema` - e.g: `arraySchema(stringSchema)`
- `objectSchema` - e.g `objectSchema<SomeInterface({ date: dateSchema })`
- `anySchema`
- `anyObjectSchema` - does `stripUnknown: false` hence permits any keys
- `idSchema` - 6-64 chars of alphanumeric plus underscore: `/^[a-z0-9_]*$/`
- `unixTimestampSchema` - allows values from 0 to a timestamp that represents 2500-01-01
- `emailSchema` - standard Joi's, does TLD validation by default, adds `lowercase()`
- `semVerSchema`
- `utcOffsetSchema`
- `ipAddressSchema`
