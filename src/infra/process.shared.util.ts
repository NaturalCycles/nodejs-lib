import * as os from 'os'

function mb (b: number): number {
  return Math.round(b / (1024 * 1024))
}

class ProcessSharedUtil {
  private timer!: NodeJS.Timer

  memoryUsage (): any {
    const m = process.memoryUsage()
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    return {
      rss: mb(m.rss),
      heapTotal: mb(m.heapTotal),
      heapUsed: mb(m.heapUsed),
      external: mb((m as any).external),
      totalMem: mb(totalMem),
      freeMem: mb(freeMem),
      usedMem: mb(totalMem - freeMem),
    }
  }

  startMemoryTimer (ms: number): void {
    console.log(this.memoryUsage())

    this.timer = setInterval(() => {
      console.log(this.memoryUsage())
    }, ms)
  }

  stopMemoryTimer (afterMs = 0): void {
    setTimeout(() => clearInterval(this.timer), afterMs)
  }

  cpuAvg (): any {
    const avg = os.loadavg()
    return {
      avg1: avg[0].toFixed(2),
      avg5: avg[1].toFixed(2),
      avg15: avg[2].toFixed(2),
    }
  }

  cpuInfo (): any {
    const c = (os.cpus() || [undefined])[0]
    return {
      count: os.cpus().length,
      model: c.model,
      speed: c.speed,
    }
  }

  async cpuPercent (ms: number): Promise<any> {
    const stats1 = this.getCPUInfo()
    const startIdle = stats1.idle
    const startTotal = stats1.total

    return new Promise(resolve => {
      setTimeout(() => {
        const stats2 = this.getCPUInfo()
        const endIdle = stats2.idle
        const endTotal = stats2.total

        const idle = endIdle - startIdle
        const total = endTotal - startTotal
        const perc = idle / total

        resolve(Math.round((1 - perc) * 100))
      }, ms)
    })
  }

  private getCPUInfo () {
    return os.cpus().reduce(
      (r, cpu) => {
        r['idle'] += cpu.times.idle
        Object.values(cpu.times).forEach(m => (r['total'] += m))
        return r
      },
      {
        idle: 0,
        total: 0,
      },
    )
  }
}

export const processSharedUtil = new ProcessSharedUtil()
