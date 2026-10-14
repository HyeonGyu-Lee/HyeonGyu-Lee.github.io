document.addEventListener("DOMContentLoaded", function () {
  const main = document.getElementById("main-content")
  const nav = document.getElementById("scroll-nav")
  if (!main || !nav) return
  const headings = [...main.querySelectorAll("h1[id], h2[id], h3[id]")].filter(
    (heading) =>
      heading.id !== "table-of-contents" &&
      !heading.classList.contains("no_toc") &&
      !heading.closest(".mcu-map")
  )
  if (!headings.length) {
    nav.hidden = true
    return
  }
  const details = document.createElement("details")
  const summary = document.createElement("summary")
  const count = document.createElement("span")
  summary.append("목차 ", count)
  details.append(summary)
  const list = document.createElement("ol")
  const links = headings.map((heading, index) => {
    const item = document.createElement("li")
    item.dataset.level = heading.tagName.slice(1)
    const link = document.createElement("a")
    link.href = `#${heading.id}`
    link.textContent = heading.textContent.trim().replace(/^#+\s*/, "")
    link.title = link.textContent
    link.addEventListener("click", (event) => {
      event.preventDefault()
      history.pushState(null, "", `#${encodeURIComponent(heading.id)}`)
      heading.setAttribute("tabindex", "-1")
      heading.focus({ preventScroll: true })
      heading.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      })
      if (window.innerWidth < 1000) details.open = false
      activate(index)
    })
    item.append(link)
    list.append(item)
    return link
  })
  details.append(list)
  nav.replaceChildren(details)
  details.open = window.innerWidth >= 1600
  let active = -1
  function activate(index) {
    if (index === active) return
    links[active]?.removeAttribute("aria-current")
    active = index
    links[active].setAttribute("aria-current", "location")
    count.textContent = `${index + 1} / ${headings.length}`
  }
  let scheduled = false
  function refresh() {
    scheduled = false
    let current = 0
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 112) current = i
      else break
    }
    if (
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
    )
      current = headings.length - 1
    activate(current)
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true
      requestAnimationFrame(refresh)
    }
  }
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  window.addEventListener("hashchange", schedule)
  main.addEventListener("load", schedule, true)
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(main)
  document.fonts?.ready.then(schedule)
  schedule()
})
