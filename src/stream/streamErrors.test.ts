import { Transform } from 'stream'
import { _range } from '@naturalcycles/js-lib'
import { writableForEach, _pipeline } from '..'
import { readableFromArray } from './readable/readableFromArray'

function errorTransformUnhandled() {
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, cb) {
      if (chunk.id === '4') throw new Error('error_in_transform')
      cb(null, chunk)
    },
  })
}

function errorTransform() {
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, cb) {
      if (chunk.id === '4') return cb(new Error('error_in_transform'))
      cb(null, chunk)
    },
  })
}

// still don't know how to handle such errors. Domains?
test.skip('unhandled transform error', async () => {
  const data = _range(1, 6).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)

  const results: any[] = []
  await expect(
    _pipeline([readable, errorTransformUnhandled(), writableForEach(r => void results.push(r))]),
  ).rejects.toThrow('error_in_transform')
})

test('handled transform error', async () => {
  const data = _range(1, 6).map(n => ({ id: String(n) }))
  const readable = readableFromArray(data)

  const results: any[] = []
  await expect(
    _pipeline([readable, errorTransform(), writableForEach(r => void results.push(r))]),
  ).rejects.toThrow('error_in_transform')
  // console.log(results)
  expect(results).toEqual(data.filter(r => r.id < '4'))
})
