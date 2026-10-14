// Kramdown requires a blank boundary before a pipe table (including after headings).
export function separateMarkdownTables(markdown) {
  const lines = markdown.split("\n")
  const output = []
  let fence = null
  for (let i = 0; i < lines.length; i++) {
    const marker = lines[i].match(/^ {0,3}(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
        fence = null
    }
    if (
      !fence &&
      /^\s*\|/.test(lines[i]) &&
      /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[i + 1] || "")
    ) {
      if (output.length && output.at(-1).trim()) output.push("")
      do {
        output.push(lines[i++])
      } while (i < lines.length && /^\s*\|/.test(lines[i]))
      if (i < lines.length && lines[i].trim()) output.push("")
      i--
    } else output.push(lines[i])
  }
  return output.join("\n")
}
