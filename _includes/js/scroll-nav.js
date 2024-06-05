document.addEventListener("DOMContentLoaded", function () {
  var mainContent = document.getElementById("main-content")
  var headers = mainContent.querySelectorAll("h1, h2, h3, h4, h5, h6")
  var scrollNav = document.querySelector(".scroll-nav")
  var markers = []
  var minSpacing = 3 // Minimum spacing between markers in percentage

  // Calculate max width for tooltips based on scroll-nav width
  function calculateTooltipMaxWidth() {
    var scrollNavWidth = scrollNav.offsetWidth
    return scrollNavWidth // Subtract additional margin
  }

  // Set CSS variable for tooltip max width
  function setTooltipMaxWidth() {
    var maxWidth = calculateTooltipMaxWidth()
    scrollNav.style.setProperty("--tooltip-max-width", maxWidth + "px")
  }

  setTooltipMaxWidth()
  window.addEventListener("resize", setTooltipMaxWidth)

  // Create scroll markers for each header with an ID, excluding "table-of-contents"
  headers.forEach(function (header, index) {
    if (header.id && header.id !== "table-of-contents") {
      // Only include headers with an ID and not "table-of-contents"
      var marker = document.createElement("a")
      marker.classList.add(
        "scroll-marker",
        "scroll-marker-" + header.tagName.toLowerCase()
      )
      marker.href = "#" + header.id // Ensure headers have unique IDs
      marker.setAttribute("data-tooltip", header.innerText)

      scrollNav.appendChild(marker)
      markers[index] = marker // Store marker at the same index as the header

      // Add click event listener to scroll markers for navigation
      marker.addEventListener("click", function (event) {
        event.preventDefault()
        var targetId = marker.getAttribute("href").substring(1)
        var targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      })
    } else {
      markers[index] = null // Ensure markers array aligns with headers array
    }
  })

  // Function to update marker positions and sizes on scroll
  function updateMarkerPositions() {
    var mainHeight = mainContent.scrollHeight
    var viewportHeight = window.innerHeight

    headers.forEach(function (header, index) {
      var marker = markers[index]
      if (marker) {
        // Check if corresponding marker exists
        var headerRect = header.getBoundingClientRect()
        var headerTop = headerRect.top + window.scrollY
        var markerPosition = (headerTop / mainHeight) * 100
        marker.style.top = markerPosition + "%"
      }
    })

    // Adjust marker positions to prevent overlap
    adjustMarkerPositions(minSpacing)

    // Update active markers
    updateActiveMarkers()
  }

  function adjustMarkerPositions(minSpacing) {
    var markerPositions = []

    markers.forEach(function (marker) {
      if (marker) {
        var top = parseFloat(marker.style.top)
        markerPositions.push({ marker: marker, top: top })
      }
    })

    markerPositions.sort(function (a, b) {
      return a.top - b.top
    })

    for (var i = 1; i < markerPositions.length; i++) {
      var previousMarker = markerPositions[i - 1]
      var currentMarker = markerPositions[i]

      if (currentMarker.top - previousMarker.top < minSpacing) {
        // Minimum spacing between markers in percentage
        currentMarker.top = previousMarker.top + minSpacing // Adjust current marker position
        currentMarker.marker.style.top = currentMarker.top + "%"
      }
    }
  }

  function updateActiveMarkers() {
    var scrollPosition = window.scrollY
    var viewportHeight = window.innerHeight

    headers.forEach(function (header, index) {
      var marker = markers[index]
      if (marker) {
        var headerTop = header.offsetTop
        var headerBottom = headerTop + header.offsetHeight

        if (
          (headerTop < scrollPosition + viewportHeight &&
            headerBottom > scrollPosition) ||
          (scrollPosition >= headerTop && scrollPosition < headerBottom)
        ) {
          marker.classList.add("active-marker")
        } else {
          marker.classList.remove("active-marker")
        }
      }
    })

    // Ensure minimum spacing between active markers
    ensureMinSpacing()
  }

  function ensureMinSpacing() {
    var activeMarkers = markers.filter(function (marker) {
      return marker && marker.classList.contains("active-marker")
    })

    for (var i = 1; i < activeMarkers.length; i++) {
      var previousMarker = activeMarkers[i - 1]
      var currentMarker = activeMarkers[i]

      var previousTop = parseFloat(previousMarker.style.top)
      var currentTop = parseFloat(currentMarker.style.top)

      if (currentTop - previousTop < minSpacing) {
        currentMarker.style.top = previousTop + minSpacing + "%"
      }
    }
  }

  // Initial marker position and size update
  updateMarkerPositions()

  // Update marker positions and sizes on scroll
  window.addEventListener("scroll", updateMarkerPositions)

  // Update marker positions and sizes on resize
  window.addEventListener("resize", updateMarkerPositions)

  // Show tooltips when the mouse is over the scroll-nav
  scrollNav.addEventListener("mouseenter", function () {
    markers.forEach(function (marker) {
      if (marker) {
        marker.classList.add("show-tooltip")
      }
    })
  })

  // Hide tooltips when the mouse leaves the scroll-nav
  scrollNav.addEventListener("mouseleave", function () {
    markers.forEach(function (marker) {
      if (marker) {
        marker.classList.remove("show-tooltip")
      }
    })
  })
})
