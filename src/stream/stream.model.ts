import { Readable, Transform, Writable } from 'stream'
import { TransformLogProgressOptions } from './transform/transformLogProgress'
import { TransformMapOptions } from './transform/transformMap'

// eslint-disable-next-line unused-imports/no-unused-vars
export interface ReadableTyped<T> extends Readable {}

// eslint-disable-next-line unused-imports/no-unused-vars
export interface WritableTyped<T> extends Writable {}

// eslint-disable-next-line unused-imports/no-unused-vars
export interface TransformTyped<IN, OUT = IN> extends Transform {}

export interface TransformOpt {
  /**
   * @default true
   */
  objectMode?: boolean

  /**
   * @default 16
   */
  highWaterMark?: number
}

export interface StreamForEachOptions<IN>
  extends TransformMapOptions<IN, void>,
    TransformLogProgressOptions<IN> {}
