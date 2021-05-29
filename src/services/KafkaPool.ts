import { Admin, AdminEvents, Consumer, Kafka, Producer, ValueOf } from 'kafkajs'

export default class KafkaPool<V extends Consumer | Admin | Producer> {
  size: number
  pool: {key: string; element: V}[] = []
  provider: () => Promise<V>
  index = 0
  interval!: NodeJS.Timeout
  watchIntervalMS = 1000

  errorTypes = ['unhandledRejection', 'uncaughtException']
  signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

  constructor (size: number, provider: () => Promise<V>) {
    this.size = size
    this.provider = provider
    this.registerCloseEvents()
  }

  public async init () {
    for (let i = 0; i < this.size; i++) {
      this.addElement()
    }
    const success: boolean = this.pool.length === this.size
    if (success) {
      this.startWatcher()
    } else {
      throw new Error('Could not start pool')
    }
  }

  public get (): {key: string; element: V} {
    if (this.index === this.pool.length - 1) {
      this.index = 0
    }
    return this.pool[this.index++]
  }

  public getByKey (key: string): V | undefined {
    if (this.index === this.pool.length - 1) {
      this.index = 0
    }
    const found = this.pool.find(e => e.key === key)
    if (found) {
      return found.element
    }
  }

  public flush () {
    this.pool.forEach(e => e.element.disconnect())
    this.pool = []
  }

  private startWatcher () {
    this.interval = setInterval(() => this.watch(), this.watchIntervalMS)
  }

  private async watch () {
    let retries = 0
    while (this.pool.length < this.size && retries < 3) {
      try { await this.addElement() } catch (err) { retries++ }
    }
  }

  private addElement () {
    this.provider().then(e => {
      if (e !== undefined) {
        this.registerForDisconnection(e)
        this.pool.push({ key: Math.random().toString(36).substr(2, 5), element: e })
      }
    })
  }

  private registerForDisconnection (element: Admin | Producer | Consumer) {
    if (KafkaPool.isAdmin(element)) {
      element.on('admin.disconnect', () => {
        this.removeFromPool()
      })
    } else if (KafkaPool.isConsumer(element)) {
      element.on('consumer.disconnect', () => {
        this.removeFromPool()
      })
    } else {
      element.on('producer.disconnect', () => {
        this.removeFromPool()
      })
    }
  }

  private removeFromPool () {
    console.log('INCOMPLETO ESTO RECIBE LA KEY')
  }

  private static isAdmin (toBeDetermined: Admin | Producer | Consumer): toBeDetermined is Admin {
    return !!(toBeDetermined as Admin)
  }

  private static isProducer (toBeDetermined: Admin | Producer | Consumer): toBeDetermined is Producer {
    return !!(toBeDetermined as Producer)
  }

  private static isConsumer (toBeDetermined: Admin | Producer | Consumer): toBeDetermined is Consumer {
    return !!(toBeDetermined as Consumer)
  }

  private registerCloseEvents () {
    this.errorTypes.map(type => {
      process.on(type, async () => {
        try {
          clearInterval(this.interval)
          await this.flush()
          process.exit(0)
        } catch (_) {
          process.exit(1)
        }
      })
    })

    this.signalTraps.map(type => {
      process.on(type, async () => {
        try {
          clearInterval(this.interval)
          await this.flush()
        } finally {
          process.kill(process.pid, type)
        }
      })
    })
  }
}
