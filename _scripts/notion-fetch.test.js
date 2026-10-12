import test from "node:test"
import assert from "node:assert/strict"
import { createNotionFetch } from "./notion-fetch.js"

function harness(responses, options = {}) {
  let time = 0
  const calls = []
  const fetch = createNotionFetch({
    now: () => time,
    sleep: async (ms) => {
      time += ms
    },
    fetch: async (url) => {
      calls.push({ url, time })
      return responses.shift()
    },
    ...options,
  })
  return { fetch, calls }
}

test("queues concurrent requests and respects the server's 32-second cooldown", async () => {
  const h = harness([
    new Response("limited", { status: 429, headers: { "Retry-After": "32" } }),
    new Response("first"),
    new Response("second"),
  ])
  const results = await Promise.all([h.fetch("first"), h.fetch("second")])
  assert.deepEqual(h.calls, [
    { url: "first", time: 0 },
    { url: "first", time: 32000 },
    { url: "second", time: 32400 },
  ])
  assert.deepEqual(await Promise.all(results.map((r) => r.text())), [
    "first",
    "second",
  ])
})

test("exhausted retries preserve the error body and allow the next request", async () => {
  const h = harness(
    [
      new Response("limited", { status: 429 }),
      new Response("still limited", { status: 429 }),
      new Response("next"),
    ],
    { maxRetries: 1 }
  )
  const failed = await h.fetch("first")
  assert.equal(failed.status, 429)
  assert.equal(await failed.text(), "still limited")
  assert.equal(await (await h.fetch("next")).text(), "next")
  assert.deepEqual(
    h.calls.map((c) => c.time),
    [0, 1000, 1400]
  )
})

test("supports HTTP-date cooldowns without retrying authentication failures", async () => {
  const h = harness([
    new Response("limited", {
      status: 429,
      headers: { "Retry-After": "Thu, 01 Jan 1970 00:00:05 GMT" },
    }),
    new Response("unauthorized", { status: 401 }),
  ])
  const response = await h.fetch("first")
  assert.equal(response.status, 401)
  assert.equal(await response.text(), "unauthorized")
  assert.deepEqual(
    h.calls.map((c) => c.time),
    [0, 5000]
  )
})
