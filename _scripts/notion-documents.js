import fs from "node:fs/promises"
import path from "node:path"

export async function queryAllPages(notion, databaseId) {
  const results = []
  let cursor
  do {
    const page = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })
    results.push(...page.results)
    cursor = page.has_more ? page.next_cursor : undefined
  } while (cursor)
  return results
}

// Only files carrying the importer's stable Notion UUID redirect are managed.
export async function indexDocuments(root) {
  const index = new Map()
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) await walk(file)
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        const source = await fs.readFile(file, "utf8")
        const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || ""
        const permalink = front.match(/^permalink: '([^']*)'$/m)?.[1]
        const redirects = [...front.matchAll(/^\s*- (.+)$/gm)]
          .map((match) => {
            const value = match[1].trim()
            return value.startsWith('"') ? JSON.parse(value) : value
          })
          .filter(
            (url) =>
              typeof url === "string" &&
              url.startsWith("/") &&
              url !== "/undefined"
          )
        const id = redirects
          .find((url) => /^\/[a-f0-9]{32}$/.test(url))
          ?.slice(1)
        if (!id) continue
        const docs = index.get(id) || []
        docs.push({ file, permalink, redirects })
        index.set(id, docs)
      }
    }
  }
  try {
    await walk(root)
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }
  return index
}

export function redirectsFor(documents, permalink, pageId, numericId) {
  return [
    ...new Set([
      `/${pageId.replaceAll("-", "")}`,
      ...(numericId == null ? [] : [`/${numericId}`]),
      ...documents.flatMap((doc) => [doc.permalink, ...doc.redirects]),
    ]),
  ].filter((url) => url && url !== permalink && url !== "/undefined")
}

export async function writeDocument(file, content, previous) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content, "utf8")
  // Remove a moved copy only after its replacement has been written successfully.
  for (const doc of previous) {
    if (path.resolve(doc.file) !== path.resolve(file)) await fs.unlink(doc.file)
  }
}
