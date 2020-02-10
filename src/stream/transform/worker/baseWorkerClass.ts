/**
 * Class to be extended, to be used with `transformMultiThreaded`
 */
import { WorkerInput, WorkerOutput } from './transformMultiThreaded.model'

export interface WorkerClassInterface {
  WorkerClass: BaseWorkerClass
}

export abstract class BaseWorkerClass<IN = any, OUT = any, WORKER_DATA = object> {
  constructor(public workerData: WORKER_DATA) {}

  abstract async process(msg: WorkerInput<IN>): Promise<WorkerOutput<OUT>>
}
