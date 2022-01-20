import { pExpectedError } from '@naturalcycles/js-lib'
import { RequestError } from 'got'
import { getGot } from './getGot'

const got = getGot({
  debug: true,
})

test('actual error', async () => {
  const err = await pExpectedError<RequestError>(myFunction())
  console.log(err)

  expect(err).toBeInstanceOf(RequestError)
  expect(err.stack).toContain('at myFunction')
})

async function myFunction(): Promise<any> {
  await got.post('http://a.com/err', {
    searchParams: { q: 1 },
    json: { a: 'a' },
    // context: {
    //   // stack: new Error('kirill'),
    // }
  })
}
