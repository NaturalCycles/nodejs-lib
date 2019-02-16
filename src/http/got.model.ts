import { GotJSONOptions } from 'got'
import * as http from 'http'

export interface GotOptions extends GotJSONOptions {}

export interface GotResponse<T = string> extends http.IncomingMessage {
  body: T
  url: string
  requestUrl: string
  fromCache: boolean
  redirectUrls?: string[]
}
