/*

yarn tsn bench/validation.bench

 */

import { runBench } from '@naturalcycles/bench-lib'
import { _range } from '@naturalcycles/js-lib'
import Ajv, { JSONSchemaType } from 'ajv'
import {
  arraySchema,
  booleanSchema,
  numberSchema,
  objectSchema,
  stringSchema,
  validate,
} from '../../src'
import { runScript } from '../../src/script'

interface Item {
  s: string
  n1: number
  n2?: number
  b1?: boolean
  a: number[]
}

const joiSchema = objectSchema<Item>({
  s: stringSchema,
  n1: numberSchema,
  n2: numberSchema.optional(),
  b1: booleanSchema.optional(),
  a: arraySchema(numberSchema),
}).options({ convert: false })

const jsonSchema: JSONSchemaType<Item> = {
  type: 'object',
  properties: {
    s: { type: 'string' },
    n1: { type: 'integer' },
    n2: { type: 'integer', nullable: true },
    b1: { type: 'boolean', nullable: true },
    a: { type: 'array', items: { type: 'integer' } },
  },
  required: ['s', 'n1', 'a'],
  additionalProperties: false,
}

const items = _range(1000).map(id => ({
  s: `id${id}`,
  n1: id,
  n2: 1,
  b1: id % 2 === 0,
  a: _range(id).map(n => n * 2),
}))

const ajv = new Ajv()
const ajvValidate = ajv.compile<Item>(jsonSchema)

runScript(async () => {
  // items.forEach(item => {
  //   // validate(item, joiSchema)
  //   const valid = ajvValidate(item)
  //   if (!valid) {
  //     console.log(ajvValidate.errors)
  //     throw new Error('invalid!')
  //   }
  // })

  await runBench({
    fns: {
      joi: async done => {
        items.forEach(item => {
          validate(item, joiSchema)
        })

        done.resolve()
      },
      ajv: async done => {
        items.forEach(item => {
          // validate(item, joiSchema)
          const valid = ajvValidate(item)
          if (!valid) {
            console.log(ajvValidate.errors)
            throw new Error('invalid!')
          }
        })
        done.resolve()
      },
    },
    runs: 2,
  })
})
