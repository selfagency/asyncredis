import Redis, { RedisOptions } from 'ioredis'
import events from 'events'

class Cache {
  client: Redis

  constructor(options: RedisOptions) {
    this.client = new Redis(options)
  }

  async set(key: string, value: unknown, ttl = 3600): Promise<string | undefined> {
    let response: string | undefined
    let ready = false
    console.debug(`Setting ${key}`)

    const emitter = new events.EventEmitter()
    emitter.on('set', async () => {
      ready = true
    })

    this.client.set(`${key}`, JSON.stringify(value), 'EX', ttl, (err, res) => {
      console.debug(`Set ${key}`)

      if (err) {
        throw err
      }
      response = res
      emitter.emit('set')
    })

    // eslint-disable-next-line no-unmodified-loop-condition
    while (!ready) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    return response
  }

  async get(key: string): Promise<unknown | undefined> {
    let response: unknown | undefined
    let ready = false
    console.debug(`Retrieving ${key}`)

    const emitter = new events.EventEmitter()
    emitter.on('get', async () => {
      ready = true
    })

    this.client.get(`${key}`, (err, res) => {
      console.debug(`Retrieved ${key}`)
      if (err) {
        throw err
      }
      response = res ? JSON.parse(<string>res) : null
      emitter.emit('get')
    })

    // eslint-disable-next-line no-unmodified-loop-condition
    while (!ready) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    return response
  }
}

export { Cache }
