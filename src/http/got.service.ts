import * as got from 'got'
import { getDebug } from '../log/debug'
import { GotOptions, GotResponse } from './got.model'
const debug = getDebug(__filename)

class GotService {
  /**
   * Just a proxy method, to simplify importing `* as got`, etc.
   */
  async got<T = string> (url: string, opt: got.GotOptions<any> = {}): Promise<GotResponse<T>> {
    return got(url, opt) as any
  }

  async request<T = any> (method: string, url: string, _opt: Partial<GotOptions> = {}): Promise<T> {
    debug(`>> ${method} ${url}`)
    const opt: GotOptions = {
      method,
      json: true,
      ..._opt,
    }

    try {
      const r = await got(url, opt)
      debug(`<< ${method} ${url}`)
      return r.body
    } catch (err) {
      return this.handleError(err, method, url)
    }
  }

  private handleError (err: any, method: string, url: string): never {
    if (!err || !err.response) throw err

    const r = err.response
    const errBody = JSON.stringify(r.body || '<empty_body>', null, 2)
    const msg = `<< ERROR ${r.statusCode} ${method} ${url}\n${errBody}`
    const e: any = new Error(msg)
    e.response = r
    throw e
  }

  // convenience methods
  async get<T = any> (url: string, opt?: Partial<GotOptions>): Promise<T> {
    return this.request<T>('GET', url, opt)
  }
  async post<T = any> (url: string, opt?: Partial<GotOptions>): Promise<T> {
    return this.request<T>('POST', url, opt)
  }
  async put<T = any> (url: string, opt?: Partial<GotOptions>): Promise<T> {
    return this.request<T>('PUT', url, opt)
  }
  async delete<T = any> (url: string, opt?: Partial<GotOptions>): Promise<T> {
    return this.request<T>('DELETE', url, opt)
  }
}

export const gotService = new GotService()
