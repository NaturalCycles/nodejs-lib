/*

yarn tsn bench/validation.bench

 */

import { runBench } from '@naturalcycles/bench-lib'
import { JsonSchema } from '@naturalcycles/common-type'
import { _range } from '@naturalcycles/js-lib'
import {
  AjvSchema,
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

const jsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    s: { type: 'string' },
    n1: { type: 'integer' },
    n2: { type: 'integer' },
    b1: { type: 'boolean' },
    a: { type: 'array', items: { type: 'integer' } },
  },
  required: ['s', 'n1', 'a'],
  additionalProperties: false,
}

const ajvSchema = new AjvSchema(jsonSchema)

const items = _range(1000).map(id => ({
  s: `id${id}`,
  n1: id,
  n2: 1,
  b1: id % 2 === 0,
  a: _range(id).map(n => n * 2),
}))

runScript(async () => {
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
          ajvSchema.validate(item)
        })
        done.resolve()
      },
    },
    runs: 2,
  })
})
