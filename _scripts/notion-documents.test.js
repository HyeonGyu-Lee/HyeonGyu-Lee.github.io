import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import {
  queryAllPages,
  indexDocuments,
  redirectsFor,
  writeDocument,
} from "./notion-documents.js"

test("database import follows the cursor beyond 100 pages", async () => {
  const calls = []
  const notion = {
    databases: {
      query: async (args) => {
        calls.push(args)
        return args.start_cursor
          ? { results: [{ id: "last" }], has_more: false, next_cursor: null }
          : {
              results: Array.from({ length: 100 }, (_, id) => ({ id })),
              has_more: true,
              next_cursor: "next",
            }
      },
    },
  }
  assert.equal((await queryAllPages(notion, "db")).length, 101)
  assert.equal(calls[1].start_cursor, "next")
})

test("moving a generated document preserves historical URLs and removes only its old file", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "notion-docs-"))
  const id = "a".repeat(32)
  const old = path.join(root, "old.md")
  const target = path.join(root, "new", "page.md")
  try {
    await fs.writeFile(
      old,
      `---\npermalink: '/old'\nredirect_from:\n - /${id}\n - /undefined\n - /older\n---\nold`
    )
    await fs.writeFile(path.join(root, "manual.md"), "handwritten content")
    const previous = (await indexDocuments(root)).get(id)
    const urls = redirectsFor(previous, "/new", id)
    assert.deepEqual(urls, [`/${id}`, "/old", "/older"])
    await writeDocument(
      target,
      `---\npermalink: '/new'\nredirect_from:\n${urls.map((u) => ` - ${JSON.stringify(u)}`).join("\n")}\n---\nnew`,
      previous
    )
    await assert.rejects(fs.access(old), { code: "ENOENT" })
    assert.equal(
      await fs.readFile(path.join(root, "manual.md"), "utf8"),
      "handwritten content"
    )
    const again = (await indexDocuments(root)).get(id)
    assert.equal(again[0].file, target)
    assert.deepEqual(redirectsFor(again, "/new", id), urls)
  } finally {
    await fs.rm(root, { recursive: true, force: true })
  }
})
