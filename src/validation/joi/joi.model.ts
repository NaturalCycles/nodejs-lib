/**
 * This type is useful to allow "joi schema merging".
 * Because by default Joi doesn't allow normal merging.
 * E.g `joiSchema.concat` doesn't play well when some property exists
 * in both left and right side.
 */
export type JoiSchemaObject<T> = Partial<Record<keyof T, any>>
