import { setTimeout } from "node:timers/promises"

export function createNotionFetch({
  fetch = globalThis.fetch,
  sleep = setTimeout,
  now = Date.now,
  intervalMs = 400,
  maxRetries = 5,
} = {}) {
  let queue = Promise.resolve()
  let nextRequestAt = 0

  async function request(args) {
    for (let retry = 0; ; retry += 1) {
      const wait = Math.max(0, nextRequestAt - now())
      if (wait > 0) await sleep(wait)
      nextRequestAt = now() + intervalMs

      const response = await fetch(...args)
      if (response.status !== 429 || retry >= maxRetries) return response

      const header = response.headers.get("retry-after")
      const seconds = header === null ? NaN : Number(header)
      const date = header === null ? NaN : Date.parse(header)
      const retryMs = Number.isFinite(seconds)
        ? Math.max(0, seconds * 1000)
        : Number.isFinite(date)
          ? Math.max(0, date - now())
          : 1000 * 2 ** retry

      nextRequestAt = Math.max(nextRequestAt, now() + retryMs)
      await response.body?.cancel?.()
    }
  }

  return (...args) => {
    const result = queue.then(() => request(args))
    queue = result.catch(() => {})
    return result
  }
}
