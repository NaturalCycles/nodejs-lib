export interface WorkerClassInterface {
  WorkerClass: BaseWorkerClass
}

/**
 * Class to be extended, to be used with `transformMultiThreaded`
 */
export abstract class BaseWorkerClass<IN = any, OUT = any, WORKER_DATA = object> {
  constructor(public workerData: WORKER_DATA) {}

  abstract async process(msg: IN, index: number): Promise<OUT>
}
