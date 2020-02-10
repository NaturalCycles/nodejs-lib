import { pDelay } from '@naturalcycles/js-lib'
import { BaseWorkerClass } from '..'
import { WorkerInput, WorkerOutput } from '..'

export class WorkerClass extends BaseWorkerClass {
  async process(msg: WorkerInput): Promise<WorkerOutput> {
    await pDelay(200)
    return msg // echo
  }
}
