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

test("Notion table source placeholders remain text, preserving rich text and code", async () => {
  const { NotionToMarkdown } = await import("notion-to-md")
  const richText = (plain_text, extra = {}) => ({
    type: "text",
    plain_text,
    annotations: { bold: false, italic: false, code: false, ...extra },
  })
  const converter = new NotionToMarkdown({
    notionClient: {
      blocks: {
        children: {
          list: async () => ({
            results: [
              {
                type: "table_row",
                table_row: { cells: [[richText("Source")]] },
              },
              {
                type: "table_row",
                table_row: {
                  cells: [
                    [
                      richText("<Mip>_Config_<PredefinedVariant.shortName> & "),
                      richText("Rte_Init_<shortName of this container>", {
                        bold: true,
                      }),
                      richText(" value", { code: true }),
                    ],
                  ],
                },
              },
            ],
            next_cursor: null,
          }),
        },
      },
    },
  })
  const markdown = await converter.blockToMarkdown({
    id: "table",
    type: "table",
    has_children: true,
    table: {},
  })
  assert.ok(
    markdown.includes(
      "&lt;Mip&gt;_Config_&lt;PredefinedVariant.shortName&gt; &amp;"
    )
  )
  assert.ok(
    markdown.includes("**Rte_Init_&lt;shortName of this container&gt;**")
  )
  assert.ok(markdown.includes("`value`"))
})
