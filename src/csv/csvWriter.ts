// Inspired by: https://github.com/ryu1kn/csv-writer/

import { AnyObject } from '@naturalcycles/js-lib'

export interface CSVWriterConfig {
  /**
   * Default: comma
   */
  delimiter?: string

  /**
   * Array of columns
   */
  columns: string[]

  /**
   * Default: true
   */
  includeHeader?: boolean
}

export class CSVWriter {
  constructor(cfg: CSVWriterConfig) {
    this.cfg = {
      delimiter: ',',
      includeHeader: true,
      ...cfg,
    }
  }

  public cfg: Required<CSVWriterConfig>

  writeRows(rows: AnyObject[]): string {
    let s = ''
    if (this.cfg.includeHeader) {
      s += this.writeHeader() + '\n'
    }
    return s + rows.map(row => this.writeRow(row)).join('\n')
  }

  writeHeader(): string {
    return this.cfg.columns.map(col => this.quoteIfNeeded(col)).join(this.cfg.delimiter)
  }

  writeRow(row: AnyObject): string {
    return this.cfg.columns
      .map(col => this.quoteIfNeeded(String(row[col] ?? '')))
      .join(this.cfg.delimiter)
  }

  private quoteIfNeeded(s: string): string {
    return this.shouldQuote(s) ? this.quote(s) : s
  }

  private quote(s: string): string {
    return `"${s.replace(/"/g, '""')}"`
  }

  private shouldQuote(s: string): boolean {
    return s.includes(this.cfg.delimiter) || s.includes('\r') || s.includes('\n') || s.includes('"')
  }
}

export function arrayToCSVString(arr: AnyObject[], cfg: CSVWriterConfig): string {
  const writer = new CSVWriter(cfg)
  return writer.writeRows(arr)
}
