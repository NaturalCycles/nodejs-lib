import { Extension, State, ValidationOptions } from '@hapi/joi'
import * as JoiLib from '@hapi/joi'

export interface DividableExtension {
  dividable(q: number): this
}

export interface DividableParams {
  q: number
}

export function dividableExtension(joi: typeof JoiLib): Extension {
  return {
    base: joi.number(),
    name: 'number',
    language: {
      dividable: 'needs to be dividable by {{q}}',
    },
    rules: [
      {
        name: 'dividable',
        params: {
          q: joi
            .number()
            .integer()
            .positive(),
        },
        validate(params: DividableParams, v: any, state: State, options: ValidationOptions) {
          if (v % params.q !== 0) {
            // tslint:disable-next-line:no-invalid-this
            return this.createError(
              'number.dividable',
              {
                v,
                q: params.q,
              },
              state,
              options,
            )
          }

          return v
        },
      },
    ],
  }
}
