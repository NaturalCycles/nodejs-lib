/*

yarn tsn debugStreams

 */

import * as fs from 'fs'
import { Readable, Transform, Writable } from 'stream'
import { createUnzip } from 'zlib'
import { pDefer, pDelay } from '@naturalcycles/js-lib'
import {
  _pipeline,
  requireEnvKeys,
  runScript,
  transformJsonParse,
  transformLimit,
  transformSplit,
  writableVoid,
} from '../src'

/* eslint-disable */

interface AbortObject {
  aborted: boolean
}

// This readable returns next number when `read` is called,
// has a delay
// Should listen to `end` event and close itself when 0 receivers

function readable(obj: AbortObject) {
  let i = 0
  const readableLimit = 100

  return new Readable({
    objectMode: true,
    async read(size: number) {
      if (obj.aborted) {
        console.log(`read, but aborted=true, emitting null to close the stream`)
        return this.push(null)
      }

      const r = ++i
      console.log(`read return`, r)
      await pDelay(50)

      if (r >= readableLimit) {
        console.log('readable limit reached, pushing null to close it')
        this.push(null) // means the end
      } else {
        this.push(r) // crucial to call this push! Otherwise node process will do process.exit(0) ?!?!?!
      }
    },
    destroy(err, cb) {
      console.log(`readable.destroy called`, err)
      cb(null)
    },
  })
}

function writable() {
  let i = 0
  return new Writable({
    objectMode: true,
    async write(chunk, _enc, cb) {
      i++
      console.log(`write called with`, i)
      await pDelay(200)
      console.log(`written`, i)
      cb()
    },
    async final(cb) {
      console.log(`writable.final called`, i)
      await pDelay(2_000)
      console.log(`writable.final done`, i)
      cb()
    },
  })
}

process.on('beforeExit', code => {
  console.log('beforeExit', code)
})

runScript(async () => {
  const { SNAPSHOTS_DIR, SNAPSHOT_ID } = requireEnvKeys('SNAPSHOTS_DIR', 'SNAPSHOT_ID')

  const readable = fs.createReadStream(`${SNAPSHOTS_DIR}/${SNAPSHOT_ID}`)

  let streamDone = pDefer()
  let i = 0

  await _pipeline(
    [
      // readable(obj),
      readable,
      createUnzip(),
      transformSplit(),
      transformJsonParse(),
      transformLimit({ limit: 20, readable, streamDone, debug: true }),
      // writable(),
      new Transform({
        objectMode: true,
        async transform(chunk, _, cb) {
          i++
          await pDelay(200)
          console.log(`transform`, i)
          cb(null, chunk)
        },
      }),
      // transformStreamDone(streamDone),
      writableVoid({ streamDone }),
      // writableLimit(readable, 10),
    ],
    { allowClose: true },
  )
  console.log('DONE')
})
