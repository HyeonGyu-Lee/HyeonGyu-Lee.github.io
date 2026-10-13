;(function () {
  const toggle = document.getElementById("theme-toggle")
  if (!toggle) return
  let savedTheme
  try {
    savedTheme = localStorage.getItem("theme")
  } catch {
    // The theme also works when browser storage is unavailable.
  }
  const preference = window.matchMedia("(prefers-color-scheme: dark)")
  function apply(theme) {
    const dark = theme === "dark"
    document.body.setAttribute("data-theme", theme)
    toggle.setAttribute("aria-pressed", String(dark))
    toggle.setAttribute(
      "aria-label",
      dark ? "라이트 모드로 전환" : "다크 모드로 전환"
    )
    toggle.innerHTML = `<svg width="18" height="18" aria-hidden="true"><use href="#svg-${dark ? "moon" : "sun"}"></use></svg>`
  }
  apply(savedTheme || (preference.matches ? "dark" : "light"))
  toggle.addEventListener("click", function () {
    savedTheme =
      document.body.getAttribute("data-theme") === "dark" ? "light" : "dark"
    apply(savedTheme)
    try {
      localStorage.setItem("theme", savedTheme)
    } catch {
      // Keep the selected theme for this page even without persistence.
    }
  })
  preference.addEventListener("change", function (event) {
    if (!savedTheme) apply(event.matches ? "dark" : "light")
  })
})()
