import { gotService } from './got.service'

const RESP = {
  a: 'bb',
}

jest.mock('got', () => {
  return jest.fn((url: string) => {
    if (url.includes('error')) {
      const err = new Error('')
      ;(err as any).response = {
        statusCode: 500,
        body: {
          err: 'error happened',
        },
      }
      throw err
    } else {
      return {
        body: {
          a: 'bb',
        },
      }
    }
  })
})

test('get, post, put, delete', async () => {
  const methods = ['get', 'post', 'put', 'delete']
  methods.forEach(async method => {
    const r = await gotService[method]('https://google.com', {
      timeout: 10000,
    })
    expect(r).toEqual(RESP)
  })
})

test('error case', async () => {
  try {
    await gotService.get('https://error.com')
    fail('expected to throw')
  } catch (err) {
    expect(err).toMatchSnapshot()
    expect(err.response).toMatchSnapshot()
  }
})
