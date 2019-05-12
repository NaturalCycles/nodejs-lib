import { processSharedUtil } from './infra/process.shared.util'
import { requireEnvKeys } from './util/env.util'
import { LRUMemoCache } from './util/lruMemoCache'
import { unzipBuffer, unzipToString, zipBuffer, zipString } from './util/zip.util'
import { ExtendedJoi, Joi } from './validation/joi/joi.extensions'
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
  userAgentSchema,
  utcOffsetSchema,
  verSchema,
} from './validation/joi/joi.shared.schemas'
import { JoiValidationError } from './validation/joi/joi.validation.error'
import {
  getValidationResult,
  JoiValidationResult,
  validate,
} from './validation/joi/joi.validation.util'

export {
  // todo: in progress, not exported yet
  // LUXON_ISO_DATE_FORMAT,
  // localDateUtil,
  // localTimeUtil,
  JoiValidationError,
  JoiValidationResult,
  validate,
  getValidationResult,
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
  idSchema,
  unixTimestampSchema,
  verSchema,
  emailSchema,
  SEM_VER_PATTERN,
  semVerSchema,
  userAgentSchema,
  utcOffsetSchema,
  ipAddressSchema,
  processSharedUtil,
  zipBuffer,
  unzipBuffer,
  zipString,
  unzipToString,
  requireEnvKeys,
  LRUMemoCache,
}
