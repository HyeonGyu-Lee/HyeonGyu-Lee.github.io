;(function () {
  async function mount(root, index) {
    if (root.dataset.ready) return
    root.dataset.ready = "true"
    const baseurl = (root.dataset.baseurl || "").replace(/\/+$/, "")
    const canvas = root.querySelector(".mcu-map-canvas")
    try {
      const responses = await Promise.all([
        fetch(root.dataset.source),
        fetch(root.dataset.links),
      ])
      if (responses.some((r) => !r.ok)) throw new Error("Map data unavailable")
      const [source, links] = await Promise.all([
        responses[0].text(),
        responses[1].json(),
      ])
      if (!window.mermaid) throw new Error("Diagram renderer unavailable")
      await new Promise((resolve, reject) => {
        try {
          window.mermaid.mermaidAPI.render(
            `mcuFeatureMap${index}`,
            source,
            (svg) => {
              canvas.innerHTML = svg
              resolve()
            }
          )
        } catch (error) {
          reject(error)
        }
      })
      const svg = canvas.querySelector("svg")
      svg.setAttribute("role", "group")
      svg.setAttribute("aria-label", root.dataset.title || "기능 관계도")
      for (const [key, link] of Object.entries(links)) {
        const node = [...svg.querySelectorAll("g.node")].find((n) =>
          n.id.startsWith(`flowchart-${key}-`)
        )
        if (!node || (link.url && !/^\/[a-f0-9]{32}$/.test(link.url)))
          throw new Error("Invalid map destination")
        if (link.description) {
          node.setAttribute("role", "button")
          node.setAttribute("tabindex", "0")
          node.setAttribute("aria-label", `${link.title} 설명 보기`)
          const show = () => {
            const panel = root.querySelector(".mcu-map-detail")
            panel.replaceChildren()
            const heading = document.createElement("h3")
            heading.textContent = link.title
            const text = document.createElement("p")
            text.textContent = link.description
            panel.append(heading, text)
            if (link.url) {
              const more = document.createElement("a")
              more.href = `${baseurl}${link.url}`
              more.textContent = "관련 상세 문서 열기 →"
              panel.append(more)
            }
            panel.hidden = false
          }
          node.addEventListener("click", show)
          node.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              show()
            }
          })
        } else {
          const anchor = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "a"
          )
          anchor.setAttribute("href", `${baseurl}${link.url}`)
          anchor.setAttribute("aria-label", `${link.title} 상세 문서`)
          anchor.setAttribute("tabindex", "0")
          node.replaceWith(anchor)
          anchor.append(node)
        }
      }
      let scale = 1
      for (const button of root.querySelectorAll("[data-map-zoom]")) {
        button.addEventListener("click", () => {
          scale =
            button.dataset.mapZoom === "fit"
              ? 1
              : Math.max(
                  1,
                  Math.min(
                    3,
                    scale + (button.dataset.mapZoom === "in" ? 0.25 : -0.25)
                  )
                )
          canvas.style.width = `${scale * 100}%`
        })
      }
      root.dataset.loaded = "true"
    } catch (error) {
      canvas.textContent =
        "관계도를 불러오지 못했습니다. 페이지를 새로고침해 주세요."
      root.dataset.error = "true"
      console.error("MCU map:", error)
    }
  }
  function start() {
    document
      .querySelectorAll("[data-mcu-map]")
      .forEach((root, index) => mount(root, index))
  }
  if (document.readyState === "complete") start()
  else window.addEventListener("load", start, { once: true })
})()
