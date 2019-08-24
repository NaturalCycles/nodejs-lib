import { processSharedUtil } from './infra/process.shared.util'
import { Debug, DebugLogLevel, IDebug, IDebugger } from './log/debug'
import {
  base64ToBuffer,
  base64ToString,
  bufferToBase64,
  hash,
  md5,
  stringToBase64,
} from './security/hash.util'
import {
  ALPHABET_ALPHANUMERIC,
  ALPHABET_ALPHANUMERIC_LOWERCASE,
  ALPHABET_ALPHANUMERIC_UPPERCASE,
  ALPHABET_LOWERCASE,
  ALPHABET_NUMBER,
  ALPHABET_UPPERCASE,
  stringId,
} from './security/id.util'
import { getSecretMap, loadSecrets, secret, secretOptional } from './security/secret.util'
import { requireEnvKeys } from './util/env.util'
import { LRUMemoCache } from './util/lruMemoCache'
import { runScript } from './util/script.util'
import { PausableObservable, streamToObservable } from './util/stream.util'
import { unzipBuffer, unzipToString, zipBuffer, zipString } from './util/zip.util'
import { ExtendedJoi, Joi } from './validation/joi/joi.extensions'
import {
  AnySchemaTyped,
  ArraySchemaTyped,
  BooleanSchemaTyped,
  NumberSchemaTyped,
  ObjectSchemaTyped,
  SchemaTyped,
  StringSchemaTyped,
} from './validation/joi/joi.model'
import {
  anyObjectSchema,
  anySchema,
  arraySchema,
  binarySchema,
  booleanSchema,
  dateStringSchema,
  emailSchema,
  idSchema,
  integerSchema,
  ipAddressSchema,
  numberSchema,
  objectSchema,
  SEM_VER_PATTERN,
  semVerSchema,
  stringSchema,
  unixTimestampSchema,
  urlSchema,
  userAgentSchema,
  utcOffsetSchema,
  verSchema,
} from './validation/joi/joi.shared.schemas'
import { JoiValidationError } from './validation/joi/joi.validation.error'
import {
  convert,
  getValidationResult,
  isValid,
  JoiValidationResult,
  undefinedIfInvalid,
  validate,
} from './validation/joi/joi.validation.util'

export {
  JoiValidationError,
  JoiValidationResult,
  validate,
  getValidationResult,
  isValid,
  undefinedIfInvalid,
  convert,
  Joi,
  ExtendedJoi,
  booleanSchema,
  stringSchema,
  numberSchema,
  integerSchema,
  dateStringSchema,
  arraySchema,
  binarySchema,
  objectSchema,
  anySchema,
  anyObjectSchema,
  SchemaTyped,
  AnySchemaTyped,
  ArraySchemaTyped,
  BooleanSchemaTyped,
  NumberSchemaTyped,
  ObjectSchemaTyped,
  StringSchemaTyped,
  idSchema,
  unixTimestampSchema,
  verSchema,
  emailSchema,
  SEM_VER_PATTERN,
  semVerSchema,
  userAgentSchema,
  utcOffsetSchema,
  ipAddressSchema,
  urlSchema,
  processSharedUtil,
  zipBuffer,
  unzipBuffer,
  zipString,
  unzipToString,
  requireEnvKeys,
  LRUMemoCache,
  stringId,
  ALPHABET_NUMBER,
  ALPHABET_LOWERCASE,
  ALPHABET_UPPERCASE,
  ALPHABET_ALPHANUMERIC_LOWERCASE,
  ALPHABET_ALPHANUMERIC_UPPERCASE,
  ALPHABET_ALPHANUMERIC,
  md5,
  hash,
  stringToBase64,
  base64ToString,
  bufferToBase64,
  base64ToBuffer,
  IDebug,
  IDebugger,
  Debug,
  DebugLogLevel,
  PausableObservable,
  streamToObservable,
  runScript,
  getSecretMap,
  loadSecrets,
  secret,
  secretOptional,
}
