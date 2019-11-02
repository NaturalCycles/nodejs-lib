import { Readable, Transform, Writable } from 'stream'

export interface ReadableTyped<T> extends Readable {}

export interface WritableTyped<T> extends Writable {}

export interface TransformTyped<IN, OUT = IN> extends Transform {}
