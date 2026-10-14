import test from "node:test"
import assert from "node:assert/strict"
import { renderSiteEmbeds } from "./site-embeds.js"
test("only registered standalone tokens render, not URLs or examples", () => {
  const token = "site:embed:mcu-peripheral-map"
  assert.equal(renderSiteEmbeds(token), "{% include components/mcu-map.html %}")
  for (const text of [
    `설명: ${token}`,
    `https://example.com/${token}`,
    `\`\`\`text\n${token}\n\`\`\``,
    `~~~\n${token}\n~~~`,
  ])
    assert.equal(renderSiteEmbeds(text), text)
  assert.throws(
    () => renderSiteEmbeds("site:embed:missing"),
    /Unknown site embed/
  )
})
test("legacy AUTOSAR canvas is upgraded outside code examples", () => {
  const old =
    '<div class="canvas-container"><canvas id="autosarCanvas"></canvas></div>'
  const expected = "{% include components/autosar-map.html %}"
  assert.equal(renderSiteEmbeds(old), expected)
  assert.equal(renderSiteEmbeds("site:embed:autosar-architecture"), expected)
  const example = `\`\`\`html\n${old}\n\`\`\``
  assert.equal(renderSiteEmbeds(example), example)
})
