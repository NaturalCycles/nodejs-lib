/*

yarn tsn runScriptFailure.script.ts
SLACK_ON_FAILURE=test yarn tsn runScriptFailure.script.ts

 */

import { AppError, pDelay } from '@naturalcycles/js-lib'
import { runScriptWithSlack } from '../src/script/runScriptWithSlack'

// const slackOnSuccess = 'test'
const slackOnSuccess = false

runScriptWithSlack(
  async () => {
    await pDelay(300)

    throw new AppError('bad error', {
      data: {
        a: 'aaa!',
      },
    })

    // return true
  },
  { slackOnSuccess },
)
