const components = new Map([
  [
    "site:embed:autosar-nvm-explorer",
    'components/standard-explorer.html module="NvM"',
  ],
  [
    "site:embed:autosar-can-explorer",
    'components/standard-explorer.html module="Can"',
  ],
  [
    "site:embed:autosar-lin-explorer",
    'components/standard-explorer.html module="Lin"',
  ],
  ["site:embed:autosar-standard-explorer", "components/standard-explorer.html"],
  ["site:embed:mcu-peripheral-map", "components/mcu-map.html"],
  ["site:embed:autosar-architecture", "components/autosar-map.html"],
])

// Only standalone, registered tokens outside fenced code become components.
export function renderSiteEmbeds(markdown) {
  let fence = null
  return markdown
    .split("\n")
    .map((line) => {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})/)
      if (marker) {
        if (!fence) fence = marker[1]
        else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
          fence = null
        return line
      }
      if (fence) return line
      const legacy =
        /^\s*<div class=["']canvas-container["']>\s*<canvas id=["']autosarCanvas["']>\s*<\/canvas>\s*<\/div>\s*$/.test(
          line
        )
      const token = legacy ? "site:embed:autosar-architecture" : line.trim()
      if (!/^site:embed:[a-z0-9-]+$/.test(token)) return line
      const component = components.get(token)
      if (!component) throw new Error(`Unknown site embed: ${token}`)
      return `{% include ${component} %}`
    })
    .join("\n")
}
