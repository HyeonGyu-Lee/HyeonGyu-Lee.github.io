import { CalloutIcon } from "../types"
import markdownTable from "markdown-table"

import fetch from "node-fetch"

export const color = (text: string, color: string) => {
  let textColor = ""
  let textType = ""
  
  if(color.includes("background") === true){
    textColor = color.split("_")[0]
    textType = "bg"
  } else {
    textColor = color
    textType = "text"
  }

  switch (textColor) {
    case "gray":
      textColor = "grey"
      break
    case "brown":
    case "orange":
    case "yellow":
    case "green":
    case "blue":
    case "purple":
    case "pink":
    case "red":
      break
    default:
      return `${text}`
  }

  return `<span class="${textType}-${textColor}-100">${text}</span>`
}

export const inlineCode = (text: string) => {
  return `\`${text}\``
}

export const inlineEquation = (text: string) => {
  return `$${text}$`
}

export const bold = (text: string) => {
  return `**${text}**`
}

export const italic = (text: string) => {
  return `*${text}*`
}

export const strikethrough = (text: string) => {
  return `~~${text}~~`
}

export const underline = (text: string) => {
  return `<u>${text}</u>`
}

export const link = (text: string, href: string) => {
  let newtext = ""
  let tail = ""
  let linkedUrl = ""

  switch(text) {
    case "video":
      let matches = href.match(/[^https:\/\/www.youtube.com\/watch?v=]+([^&]+)/)
      let video_id = matches ? matches[0] : false
      if(video_id !== false) {
        linkedUrl = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${video_id}" title="RapidAUTO Guide Video" class="styled-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`     
      } else {
        newtext = decodeURI(decodeURIComponent(text))
        tail = `{: target="_blank"}`
        linkedUrl = `[${newtext}](${href})${tail}`
      }
      break;
    default:
      newtext = decodeURI(decodeURIComponent(text))
      tail = `{: target="_blank"}`
      linkedUrl = `[${newtext}](${href})${tail}`
      break;
  }

  return linkedUrl
}

export const link_contents = (text: string, href: string, color: string) => {
  let newtext = decodeURI(decodeURIComponent(text))
  let btn_option = undefined
  let tag_option = ""

  let decodeText = decodeURI(decodeURIComponent(href))
  let regex = /(["'])(?:(?=(\\?))\2.)*?\1/g
  let matches = decodeText.match(regex)
  if (matches)
  {
    const extracted = matches.map(match => match.slice(1, -1))
    return `<span class="tooltip">${newtext}<span class="tooltiptext">${extracted}</span></span>`
  }

  regex = /^\#.*/g;
  if(regex.test(decodeText))
  {
    const anchorLink = decodeText.toLowerCase().replace(
      /([\s])|([\(\)])/g,
      (match, p1, p2) => {
        if (p1) {
          return "-"
        } else if (p2) {
          return ""
        }
        return `${match}`
      }
    )

    return  `<a href="${anchorLink}">${newtext}</a>`
  }

  switch(color){
    case "gray_background":
      btn_option = ".btn .btn-gray"
      break
    case "brown_background":
      btn_option = ".btn .btn-brown"
      break;
    case "orange_background":
      btn_option = ".btn .btn-orange"
      break;
    case "yellow_background":
      btn_option = ".btn .btn-yellow"
      break;
    case "green_background":
      btn_option = ".btn .btn-green"
      break;
    case "blue_background":
      btn_option = ".btn .btn-blue"
      break;
    case "purple_background":
      btn_option = ".btn .btn-purple"
      break;
    case "pink_background":
      btn_option = ".btn .btn-pink"
      break;
    case "red_background":
      btn_option = ".btn .btn-red"
      break;
    default:
      break;
  }

  if(btn_option !== undefined) {
    tag_option = `{: ${btn_option} target="_blank"}`
  }

  return `[${newtext}](${href})${tag_option}`
}

export const codeBlock = (text: string, language?: string) => {
  if (language === "plain text") language = "text"

  return `\`\`\`${language}
${text}
\`\`\``
}

export const equation = (text: string) => {
  return `$$
${text}
$$`
}

export const heading1 = (text: string) => {
  return `# ${text}`
}

export const heading2 = (text: string) => {
  return `## ${text}`
}

export const heading3 = (text: string) => {
  return `### ${text}`
}

export const quote = (text: string) => {
  // the replace is done to handle multiple lines
  return `> ${text.replace(/\n/g, "  \n> ")}`
}

export const callout = (text: string, icon?: CalloutIcon, color?: string) => {
  let emoji: string | undefined
  let header = ""
  let callout_option = ""
  switch(icon?.type){
    case "emoji":
      emoji = icon.emoji
      header = emoji ? emoji + " " : ""
      switch(emoji) {
        case "🚨":
          color = "warning"
          break;
        case "💡":
          color = "notice"
          break;
        case "⚠️":
          color = "caution"
          break;
        default:
          break;
      }
      break;
    case "file":
      const url = new URL(icon.file.url);
      header = `![${url.pathname.split("/")[3]}](${icon.file.url})`
      break;
    default:
      break;
  }

  switch(color){
    case "gray_background":
      callout_option = "grey"
      break
    case "brown_background":
      callout_option = "brown"
      break;
    case "orange_background":
      callout_option = "orange"
      break;
    case "yellow_background":
      callout_option = "yellow"
      break;
    case "green_background":
      callout_option = "green"
      break;
    case "blue_background":
      callout_option = "blue"
      break;
    case "purple_background":
      callout_option = "purple"
      break;
    case "pink_background":
      callout_option = "pink"
      break;
    case "red_background":
      callout_option = "red"
      break;
    case "warning":
      callout_option = "warning"
      break;
    case "notice":
      callout_option = "notice"
      break;
    case "caution":
      callout_option = "caution"
      break;
    case "default":
      callout_option = "white"
      break;
    default:
      callout_option = "white"
      break;
  }

  // the replace is done to handle multiple lines
  return `<blockquote class="${callout_option}">
<div class="callout">
<div class="callout-icon" markdown="1">
${header}
</div>
<div class="callout-content" markdown="1">
${text.replace(/(^\n+|\n{3,})/g, '\n\n').replace(/(?<!\n)(\n)(?!(?:\n|-|\!\[))/g, '<br>')}
</div>
</div>
</blockquote>
`
}

export const bullet = (text: string, count?: number) => {
  // let renderText = text.trim()
  let renderText = text.replace(/\n/g, "\n    ")
  return count ? `${count}. ${renderText}` : `- ${renderText}`
}

export const todo = (text: string, checked: boolean) => {
  return checked ? `- [x] ${text}` : `- [ ] ${text}`
}

export const image = async (
  alt: string,
  href: string,
  convertToBase64: boolean = false
): Promise<string> => {
  // In case the user does not want to convert the images to Base64
  // or the image is already base64
  if (!convertToBase64 || href.startsWith("data:")) {
    if (href.startsWith("data:")) {
      // Extract base64 data, i.e. the string after 'data:mime/type;base64,'
      const base64 = href.split(",").pop()

      // This overrides incorrect data: string format to png
      // so that browsers can correctly render the data
      return `![${alt}](data:image/png;base64,${base64})`
    }

    return `![${alt}](${href})`
  } else {
    // Otherwise, download the image and convert it to base64
    const res = await fetch(href)
    const buf = await res.arrayBuffer()

    const base64 = Buffer.from(buf).toString("base64")

    return `![${alt}](data:image/png;base64,${base64})`
  }
}

export const addTabSpace = (text: string, n = 0) => {
  const tab = "    "
  for (let i = 0; i < n; i++) {
    if (text.includes("\n")) {
      const multiLineText = text.split(/(?:^|\n)/).join(`\n${tab}`)
      text = tab + multiLineText
    } else text = tab + text
  }
  return text
}

export const divider = () => {
  return "---"
}

export const toggle = (summary?: string, children?: string) => {
  if (!summary) return children || ""
  return `
<details>
<summary>${summary}</summary>
<blockquote markdown="1"> 
${children || ""}
</blockquote> 
</details>
`
}

export const table = (cells: string[][]) => {
  cells = cells.map(innerList =>
    innerList.map(string => string.includes('\n') ? string.replace(/\n/g, '<br>') : string)
  )

  return markdownTable(cells)
}
