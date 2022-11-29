# Asyncredis

Event-driven async wrapper for ioredis with TypeScript support. Not a full implementation as of yet.

## Install

```
npm i @selfagency/asyncredis
```

## Usage

```ts
import { Cache } from '@selfagency/asyncredis'

// define cache (ioredis config object)
const cache = new Cache({
  host: 'localhost',
  port: 6379,
  password: 'password',
  db: 0,
})

// define key
const key = 'my:awesome:key'

// define ttl
const ttl = 60 * 60 // 1 hour (default)

// set value
await cache.set(key, { some: 'data' }, ttl)

// get value
const result = await cache.get(key)

// result = { some: 'data' }
```
