import fs from "node:fs/promises"
import path from "node:path"
import sizeOf from "image-size"

export async function reserveImageSpace(markdown, root = process.cwd()) {
  const lines = markdown.split("\n")
  let fence = null
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^ {0,3}(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length)
        fence = null
      continue
    }
    if (fence) continue
    const images = [...lines[index].matchAll(/<img\b[^>]*>/gi)]
    for (const [image] of images) {
      if (/\bwidth="\d+"/.test(image) && /\bheight="\d+"/.test(image)) continue
      const src = image.match(/\bsrc=["']([^"']+)["']/)?.[1]
      if (!src?.startsWith("/") || src.startsWith("//")) continue
      const file = path.resolve(
        root,
        "." + decodeURIComponent(src.split(/[?#]/)[0])
      )
      if (!file.startsWith(path.resolve(root) + path.sep)) continue
      try {
        const { width, height } = sizeOf(await fs.readFile(file))
        if (width && height) {
          const replacement = image
            .replace(/\s(?:width|height)=["'][^"']*["']/g, "")
            .replace(/<img\b/i, `<img width="${width}" height="${height}"`)
          lines[index] = lines[index].replace(image, replacement)
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error
      }
    }
  }
  return lines.join("\n")
}
