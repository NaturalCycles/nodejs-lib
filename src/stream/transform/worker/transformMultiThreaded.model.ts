export interface WorkerInput<IN = any> {
  /**
   * Index of the chunk received (global), which identifies the message. Starts with 0.
   */
  index: number

  /**
   * Input chunk data.
   */
  payload: IN
}

export interface WorkerOutput<OUT = any> {
  /**
   * Index of the chunk received (global), which identifies the message. Starts with 0.
   */
  index: number

  /**
   * Output of the worker.
   */
  payload: OUT
}
