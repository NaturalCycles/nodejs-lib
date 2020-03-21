import { Readable, Transform, Writable } from 'stream'

export interface ReadableTyped<T> extends Readable {}

export interface WritableTyped<T> extends Writable {}

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
