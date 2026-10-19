;(function () {
  function start() {
    const article = document.querySelector(".technical-article")
    if (!article || article.dataset.studyReady) return
    article.dataset.studyReady = "true"
    const chapters = Array.from(article.children).filter(
      (node) =>
        node.tagName === "H2" &&
        node.id &&
        !node.classList.contains("text-delta")
    )
    if (chapters.length < 3) return
    const outline = document.createElement("details")
    outline.className = "study-outline"
    const summary = document.createElement("summary")
    summary.textContent = "목차 · " + chapters.length + "개 절"
    const list = document.createElement("ol")
    for (const chapter of chapters) {
      const row = document.createElement("li")
      const link = document.createElement("a")
      link.href = "#" + encodeURIComponent(chapter.id)
      link.textContent = chapter.textContent.trim()
      row.append(link)
      list.append(row)
    }
    outline.append(summary, list)
    article.querySelector("h1")?.after(outline)
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start)
  else start()
})()
