import { JoiSchemaObject } from './joi.model'
import { numberSchema, objectSchema, stringSchema } from './joi.shared.schemas'
import { validate } from './joi.validation.util'

interface ItemBM {
  id?: string
  updated?: number
}

interface ItemDBM {
  id: string
  updated: number
}

const itemBMSchemaObject: JoiSchemaObject<ItemBM> = {
  id: stringSchema.optional(),
  updated: numberSchema.optional(),
}

const itemBMSchema = objectSchema<ItemBM>({
  ...itemBMSchemaObject,
})

const itemDBMSchema = objectSchema<ItemDBM>({
  ...itemBMSchemaObject,
  id: stringSchema,
  updated: numberSchema,
})

test('joiSchemaObject', () => {
  validate({}, itemBMSchema)
  validate(
    {
      id: 'id',
      updated: 1,
    },
    itemDBMSchema,
  )
})
