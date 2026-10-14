const navigationStateKey = "engineering-notes:expanded-navigation:v1"

function navigationBranches() {
  return [...document.querySelectorAll("#site-nav .nav-list-item")]
    .map((item) => ({
      item,
      button: item.querySelector(":scope > .nav-list-expander"),
      href: item.querySelector(":scope > .nav-list-link")?.getAttribute("href"),
    }))
    .filter(({ button, href }) => button && href)
}

function restoreNavigationState() {
  try {
    const saved = JSON.parse(localStorage.getItem(navigationStateKey) || "[]")
    if (!Array.isArray(saved)) return
    const expanded = new Set(saved.filter((href) => typeof href === "string"))
    for (const { item, button, href } of navigationBranches()) {
      if (expanded.has(href)) item.classList.add("active")
      button.setAttribute(
        "aria-pressed",
        String(item.classList.contains("active"))
      )
    }
  } catch {
    // Navigation remains usable when storage is blocked or malformed.
  }
}

function saveNavigationState() {
  const expanded = navigationBranches().filter(({ item, button }) => {
    const open = item.classList.contains("active")
    button.setAttribute("aria-pressed", String(open))
    return open
  })
  try {
    localStorage.setItem(
      navigationStateKey,
      JSON.stringify(expanded.map(({ href }) => href))
    )
  } catch {
    // A storage failure must not interrupt link or expander interaction.
  }
}

function initializeNavigationScroll() {
  const nav = document.getElementById("site-nav")
  if (!nav) return
  const key = "engineering-notes:navigation-scroll:v1"
  let position = null
  let interacted = false
  try {
    const saved = sessionStorage.getItem(key)
    const value = saved === null ? NaN : Number(saved)
    if (Number.isFinite(value) && value >= 0) position = value
  } catch {
    // Storage may be unavailable; keep normal navigation working.
  }
  function restore() {
    if (position !== null && nav.clientHeight > 0) nav.scrollTop = position
  }
  function save() {
    // A closed mobile menu must not replace its previous position with zero.
    if (nav.clientHeight === 0) return
    position = nav.scrollTop
    try {
      sessionStorage.setItem(key, String(position))
    } catch {
      // Saving position is optional, never block a link.
    }
  }
  if (position === null) scrollNav()
  else restore()
  for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
    nav.addEventListener(
      event,
      () => {
        interacted = true
      },
      { passive: true }
    )
  }
  // Save synchronously before a link unloads this document.
  nav.addEventListener("click", save, true)
  nav.addEventListener("scroll", save, { passive: true })
  window.addEventListener("pagehide", save)
  document.fonts?.ready.then(() => {
    if (!interacted) restore()
  })
  document.getElementById("menu-button")?.addEventListener("click", () => {
    requestAnimationFrame(restore)
  })
}
