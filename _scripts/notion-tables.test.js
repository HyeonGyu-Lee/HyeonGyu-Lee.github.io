import test from "node:test"
import assert from "node:assert/strict"
import { separateMarkdownTables } from "./markdown-tables.js"

test("separates a Notion pipe table from its heading and following paragraph", () => {
  const table = "| 영역 | 의미 |\n| --- | --- |\n| Can | Driver |"
  assert.equal(
    separateMarkdownTables(`## 책임\n${table}\n설명`),
    `## 책임\n\n${table}\n\n설명`
  )
  const normalized = separateMarkdownTables(`## 책임\n${table}\n설명`)
  assert.equal(separateMarkdownTables(normalized), normalized)
  const example = `\`\`\`markdown\n## 책임\n${table}\n\`\`\``
  assert.equal(separateMarkdownTables(example), example)
})
