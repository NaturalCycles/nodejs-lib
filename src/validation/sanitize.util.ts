import * as sanitize from 'sanitize-html'

export type SanitizeHTMLOptions = sanitize.IOptions

/**
 * Simply a wrapper around `sanitize-html` library.
 *
 * @experimental
 */
export function sanitizeHTML(s: string, opt?: SanitizeHTMLOptions): string {
  return sanitize(s, opt)
}
