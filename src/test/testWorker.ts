import { pDelay } from '@naturalcycles/js-lib'
import { BaseWorkerClass } from '..'

export class WorkerClass extends BaseWorkerClass {
  async process(msg: any): Promise<any> {
    await pDelay(200)
    return msg // echo
  }
}
