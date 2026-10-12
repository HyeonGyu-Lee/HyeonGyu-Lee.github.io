import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import moment from "moment"
import moment_timezone from "moment-timezone"
import path from "path"
import fs from "fs"
import https from "https"
import sharp from "sharp"
import { SitemapStream, streamToPromise } from "sitemap"
import { Readable } from "stream"
import sizeOf from "image-size"

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({
  notionClient: notion,
  config: {
    separateChildPage: true,
  },
})

const excludeType = ".(png|jpeg|jpg|bmp|webp|gif)"
const regexPattern = `https:\/\/.*s3.us-west-2.amazonaws.com.+(${excludeType}).+x-id=GetObject`
let launchType

// Image Functions
function findImageUrl(text) {
  const regex = new RegExp(regexPattern, "g")
  return text.match(regex) || []
}

function replaceUrl(text, oldUrls, newUrls) {
  oldUrls.forEach((url, index) => {
    text = text.replace(url, newUrls[index])
  })
  return text
}

async function deleteAllFiles(folderPath) {
  const files = await fs.promises.readdir(folderPath)

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(folderPath, files[i])
    try {
      await fs.promises.unlink(filePath)
    } catch (err) {
      console.error(`\nError deleting file:`, filePath, err)
    }
  }

  // Remove this line to prevent deleting the _images folder
  // await fs.promises.rm("_images", { recursive: true })
}

function downloadImage(url, fileName) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(fileName)
    https
      .get(url, { responseType: "arraybuffer" }, (response) => {
        response.pipe(file)
        file.on("finish", () => {
          file.close(resolve)
        })
      })
      .on("error", (err) => {
        fs.unlink(fileName, () => {
          reject(err)
        })
      })
  })
}

async function downloadImages(path, imageUrls) {
  const localUrls = await Promise.all(
    imageUrls.map(async (url, index) => {
      const ext = url.split(".").pop().split("?")[0] || "png"
      const format = "webp"
      const originalFileName = `${path}/${index + 1}.${ext}`
      const newFileName = `${path}/${index + 1}.${format}`

      await downloadImage(url, originalFileName)
      const fileContent = await fs.promises.readFile(originalFileName)
      const quality = 90

      await sharp(fileContent, { limitInputPixels: false, pages: -1 })
        .toFormat(format, { quality })
        .toFile(newFileName)

      // Delete the original downloaded image file after conversion
      await fs.promises.unlink(originalFileName)

      return newFileName
    })
  )

  // No need to delete all files in the path here
  // await deleteAllFiles(path)

  return localUrls
}

function generateSitemap(links) {
  const stream = new SitemapStream({
    hostname: "https://RapidAUTO.io/",
    lastmodDateOnly: true,
  })
  streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
    fs.writeFile("sitemap.xml", data.toString(), (err) => {
      if (err) {
        console.log(`\nerr`)
      }
    })
  })
}

function escapeCodeBlock(body) {
  const regex = /```([\s\S]*?)```/g
  return body?.replace(regex, function (match, htmlBlock) {
    return "```" + htmlBlock + "```\n"
  })
}

function convertLazyImage(body) {
  // const regexPattern = /(^\s*)!\[([\s\S]*?)\]\((https:\/\/rapidauto-image[\s\S]*?)\)/gm;

  const regexPattern = new RegExp(
    /(^\s*)!\[([\s\S]*?)\]\(.(\/_images\/[^()]*?(?:\([^()]*?\)[^()]*?)*?)\)/,
    "gm"
  )
  const regexCaption = new RegExp(`${excludeType}$`, "gi")

  return body?.replace(
    regexPattern,
    (match, leadingWhitespace, caption, url) => {
      const trimmedLeadingWhitespace = leadingWhitespace.replace(/\n/g, "")

      // Check if the match is within a class="callout-content" div tag
      const beforeMatch = body.substring(0, body.indexOf(match))
      const inCalloutContent = /class="callout-content"/.test(beforeMatch)

      let adjustedWhitespace = trimmedLeadingWhitespace

      if (inCalloutContent) {
        const calloutMatch = beforeMatch.match(
          /(^\s*)<div class="callout-content"/m
        )
        if (calloutMatch) {
          const calloutLeadingWhitespace = calloutMatch[1]
          const whitespaceLengthDifference =
            trimmedLeadingWhitespace.length - calloutLeadingWhitespace.length

          if (whitespaceLengthDifference > 0) {
            adjustedWhitespace = trimmedLeadingWhitespace.slice(
              whitespaceLengthDifference
            )
          }
        }
      }

      // const urlPath = path.join("/", url)
      const urlPath = url.replace(/\\/g, "/")
      const escapedCaption = caption.replace(/[<>\|]/g, (match) => `\\${match}`)

      const { width, height } = sizeOf(fs.readFileSync("." + urlPath))

      const templateWithCaption = `
<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="${urlPath}" href="${urlPath}" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="${urlPath}" title="" class="lazyload" />
<figcaption>${escapedCaption}</figcaption>
</figure>
</a>
</div>
</div>
</div>
`
      // style="width: ${width}px; height: ${height}px;"

      const templateWithoutCaption = `
<div class="image-flex">
<div class="image-item">
<div class="image-item-img">
<a data-fslightbox="${urlPath}" href="${urlPath}" data-type="image" aria-label="This is fslightbox">
<div class="skeleton-loading">
<div class="skeleton-img"></div>
</div>
<figure>
<img loading="lazy" alt src="${urlPath}" title="" class="lazyload" />
</figure>
</a>
</div>
</div>
</div>
`

      const template = caption.match(regexCaption)
        ? templateWithoutCaption
        : templateWithCaption

      const paddedTemplate = template
        .split("\n")
        .map((line) => `${adjustedWhitespace}${line}`)
        .join("\n")

      return `${paddedTemplate}`
    }
  )
}

function findPath(data, title) {
  const node = data.find((item) => item.title === title)
  if (!node) return []
  if (!node.parent) return [node.title]
  return [...findPath(data, node.parent), node.title]
}

function getPathString(pathArray) {
  const pathWithoutLast = pathArray.slice(0, -1)
  return "/" + pathWithoutLast.join("/")
}

function debugLog(text) {
  if (launchType) {
    console.log(`\n${launchType} : ${text}`)
    return launchType
  }
  return launchType
}

function printProgressBar(percent) {
  const width = 50
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled

  const bar = `[${"=".repeat(filled)}${" ".repeat(empty)}] ${percent}%`
  process.stdout.write("\r" + bar)
}

function updateProgress(target) {
  if (target < 0 || target > 100) {
    console.error(`\nTarget progress must be between 0 and 100.`)
    return
  }

  printProgressBar(target)
  if (target === 100) console.log("\nDone!")
}

async function uncheckCheckbox(databaseId, pageId) {
  try {
    const response = await notion.pages.update({
      database_id: databaseId,
      page_id: pageId,
      properties: {
        배포: {
          checkbox: false,
        },
      },
    })
  } catch (error) {
    console.error(`\n"Uncheck Failed:"`, error)
  }
}

;(async () => {
  launchType = process.argv[2]
  debugLog(`Process Start`)

  // ensure directory exists
  const root = `docs`
  const imageRoot = "_images"

  const databaseId = process.env.DATABASE_ID
  const response = await notion.databases.query({
    database_id: databaseId,
    // filter: {
    //   and: [
    //     {
    //       property: "공개",
    //       checkbox: {
    //         equals: true,
    //       },
    //     },
    //   ],
    // },
  })

  const links = []
  let count = 0
  let processSize = 0

  const data = []
  function addData(title, parent) {
    data.push({ title, parent })
  }

  // 경로 찾기
  for (const r of response.results) {
    addData(
      r.properties?.["제목"]?.["title"][0]?.["plain_text"].replace(
        /([\s])|([\/\\\.])/g,
        (match, p1, p2) => {
          if (p1) {
            return "_"
          } else if (p2) {
            return "-"
          }
          return `${match}`
        }
      ),
      r.properties?.["상위폴더"]?.["rich_text"][0]?.["plain_text"].replace(
        /([\s])|([\/\\\.])/g,
        (match, p1, p2) => {
          if (p1) {
            return "_"
          } else if (p2) {
            return "-"
          }
          return `${match}`
        }
      )
    )
    processSize += 1
  }

  updateProgress((0).toFixed(2))
  for (const r of response.results) {
    count += 1

    const id = r.id

    // permalink
    let pk = ""
    let lTitle = ""

    // 제목
    let title = id
    let pTitle = r.properties?.["제목"]?.["title"]
    if (pTitle?.length > 0) {
      title = pTitle[0]?.["plain_text"]
      lTitle = pk = title.replace(/([\s])|([\/\\\.])/g, (match, p1, p2) => {
        if (p1) {
          return "_"
        } else if (p2) {
          return "-"
        }
        return `${match}`
      })
    } else {
      pk = r.properties?.["ID"]?.["unique_id"]?.["number"]
    }

    const filepath = getPathString(findPath(data, pk))

    let linkPath = filepath.replace(/\s/g, "_") + "/"
    let folderPath = `${root}`

    if (filepath === "/") {
      linkPath = "/"
      folderPath = `${root}/${pk}`
    } else {
      folderPath = `${root}${filepath}`
    }

    let fTitle = `${pk}.md`

    // 메인
    let hasChild = r.properties?.["메인"]?.["checkbox"] || false

    //공개
    let isOpened = r.properties?.["공개"]?.["checkbox"] || false

    if (isOpened === false) {
      try {
        if (fs.existsSync(path.join(folderPath))) {
          if (hasChild) {
            fs.rmSync(path.join(folderPath), { recursive: true })
          } else {
            fs.rmSync(path.join(folderPath, fTitle), { recursive: true })
          }

          // debugLog(`${path.join(folderPath)}\/${pk}.md 삭제`)
        }
      } catch (err) {
        debugLog(`${path.join(folderPath)}\/${pk}.md 삭제 실패`)
        console.error(`\nError while deleting sample.`)
      }

      continue
    }

    // 배포
    let isPublished = r.properties?.["배포"]?.["checkbox"] || false
    let modifiedDate = moment(r.last_edited_time)
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD-HH-MM-SS")
    // 사이트맵
    links.push({
      url: `${linkPath}${lTitle}`,
    })

    // 배포인 경우에만 파일 생성
    if (isPublished | (launchType === "all")) {
      // print log
      // debugLog(
      //   `${count}/${response.results.length} - ${r.properties?.["제목"]?.["title"][0]?.["plain_text"]}`
      // )

      // 순번
      let navOrder = r.properties?.["순번"]?.["number"] || ""

      // parent 설정
      let parentTitle =
        r.properties?.["상위폴더"]?.["rich_text"][0]?.["plain_text"]

      // 리다이렉트
      let redirectlink = r.id.replace(/\-/g, "")

      // 목차
      let hasToc = r.properties?.["목차"]?.["checkbox"] || false

      // 작성일
      let publishedDate = moment(r.created_time)
        .tz("Asia/Seoul")
        .format("YYYY-MM-DD-HH-MM-SS")

      let header = `---
layout: default
title: ${title.replace(/(^[\.])/g, (match, p1) => {
        if (p1) {
          return `\\${match}`
        }
        return `${match}`
      })}
has_children: ${hasChild}
published_date: ${publishedDate}
last_modified_date: ${modifiedDate}`
      if (navOrder) {
        header += `
nav_order: ${navOrder}`
      }
      if (parentTitle != undefined) {
        header += `
parent: '${parentTitle}'`
      }
      header += `
permalink: '${linkPath}${lTitle}'`
      header += `
redirect_from:
 - /${redirectlink}
 - /${r.properties?.["ID"]?.["unique_id"]?.["number"]}`
      header += `
---`
      if (~hasChild && hasToc) {
        header += `
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}`
      }

      let imagePath
      if (filepath === "/") {
        imagePath = `${imageRoot}/${pk}`
      } else {
        imagePath = `${imageRoot}${filepath}/${pk}`
      }
      // debugLog(`imagepath=${imagePath}`)

      fs.mkdirSync(folderPath, { recursive: true })

      const mdBlocks = await n2m.pageToMarkdown(id)
      let body = n2m.toMarkdownString(mdBlocks)["parent"]

      // undefined check
      if (body === undefined) {
        body = ""
      } else {
        // download image
        const imageUrls = findImageUrl(body)

        if (imageUrls.length > 0) {
          fs.mkdirSync(`./${imagePath}`, { recursive: true })
          const localUrls = await downloadImages(`./${imagePath}`, imageUrls)
          body = replaceUrl(body, imageUrls, localUrls)
          body = convertLazyImage(body)
        }

        // code block escape
        body = escapeCodeBlock(body)
      }

      //writing to file
      // debugLog(`writeFilepath=${folderPath}`)
      fs.writeFile(path.join(folderPath, fTitle), header + body, (err) => {
        if (err) {
          console.log(`\nerr`)
        } else {
          if (launchType !== "dev" && launchType !== "all") {
            uncheckCheckbox(databaseId, r.id)
          }
        }
      })
    }
    updateProgress(((count / processSize) * 100).toFixed(2))
  }

  generateSitemap(links)
})()
