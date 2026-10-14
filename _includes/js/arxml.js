// Compatibility for existing Notion HTML blocks; new pages use the embed token.
document.addEventListener("DOMContentLoaded", function () {
  let legacyFound = false
  document.querySelectorAll(".arxml[data-files]").forEach((legacy) => {
    const host = legacy.closest(".arxml-container") || legacy
    const explorer = document.createElement("section")
    explorer.className = "standard-explorer"
    explorer.dataset.standardModule = legacy.id || "Dcm"
    explorer.dataset.standardBase = "/assets/standards/"
    explorer.setAttribute("aria-label", "AUTOSAR 표준 Explorer")
    host.replaceWith(explorer)
    legacyFound = true
  })
  if (legacyFound) {
    const script = document.createElement("script")
    script.src = "/assets/js/standard-explorer.js"
    document.head.append(script)
  }
})
