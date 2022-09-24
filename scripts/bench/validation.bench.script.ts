/*

yarn tsn bench/validation.bench

 */

import { runBench } from '@naturalcycles/bench-lib'
import { jsonSchema, _range } from '@naturalcycles/js-lib'
import { z } from 'zod'
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

// const jsonSchema1: JsonSchema = {
//   type: 'object',
//   properties: {
//     s: { type: 'string' },
//     n1: { type: 'integer' },
//     n2: { type: 'integer' },
//     b1: { type: 'boolean' },
//     a: { type: 'array', items: { type: 'integer' } },
//   },
//   required: ['s', 'n1', 'a'],
//   additionalProperties: false,
// }

const jsonSchema2 = jsonSchema
  .object<Item>({
    s: jsonSchema.string(),
    n1: jsonSchema.number(),
    n2: jsonSchema.number().optional(),
    b1: jsonSchema.boolean().optional(),
    a: jsonSchema.array(jsonSchema.number()),
  })
  .build()

const ajvSchema = AjvSchema.create(jsonSchema2)

const zodSchema = z.object({
  s: z.string(),
  n1: z.number(),
  n2: z.number().optional(),
  b1: z.boolean().optional(),
  a: z.array(z.number()),
})

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
      joi: done => {
        items.forEach(item => {
          validate(item, joiSchema)
        })

        done.resolve()
      },
      zod: done => {
        items.forEach(item => {
          zodSchema.parse(item)
        })

        done.resolve()
      },
      ajv: done => {
        items.forEach(item => {
          ajvSchema.validate(item)
        })
        done.resolve()
      },
    },
    runs: 2,
  })
})
