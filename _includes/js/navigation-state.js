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
