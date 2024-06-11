document.addEventListener("DOMContentLoaded", function () {
  var mainContent = document.getElementById("main-content")
  var headers = mainContent.querySelectorAll("h1, h2, h3, h4, h5, h6")
  var scrollNav = document.querySelector(".scroll-nav")
  var markers = []
  var minSpacing = 3 // 마커 사이의 최소 간격 (백분율)

  // 스크롤 네비게이션 너비를 기준으로 툴팁 최대 너비 계산
  function calculateTooltipMaxWidth() {
    var scrollNavWidth = scrollNav.offsetWidth
    return scrollNavWidth // 추가 마진 제외
  }

  // CSS 변수로 툴팁 최대 너비 설정
  function setTooltipMaxWidth() {
    var maxWidth = calculateTooltipMaxWidth()
    scrollNav.style.setProperty("--tooltip-max-width", maxWidth + "px")
  }

  setTooltipMaxWidth()
  window.addEventListener("resize", setTooltipMaxWidth)

  // ID가 있는 각 헤더에 대해 스크롤 마커 생성, "table-of-contents" 제외
  headers.forEach(function (header, index) {
    if (header.id && header.id !== "table-of-contents") {
      var marker = document.createElement("a")
      marker.classList.add(
        "scroll-marker",
        "scroll-marker-" + header.tagName.toLowerCase()
      )
      marker.href = "#" + header.id // 헤더에 고유 ID 부여
      marker.setAttribute("data-tooltip", header.innerText)

      scrollNav.appendChild(marker)
      markers[index] = marker // 마커를 헤더와 동일한 인덱스에 저장

      // 스크롤 마커에 클릭 이벤트 리스너 추가
      marker.addEventListener("click", function (event) {
        event.preventDefault()
        var targetId = marker.getAttribute("href").substring(1)
        var targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" })
        }
      })
    } else {
      markers[index] = null // 마커 배열이 헤더 배열과 일치하도록 설정
    }
  })

  // 스크롤 시 마커 위치와 크기를 업데이트하는 함수
  function updateMarkerPositions() {
    var mainHeight = mainContent.scrollHeight
    var viewportHeight = window.innerHeight
    var markerPositions = []

    headers.forEach(function (header, index) {
      var marker = markers[index]
      if (marker) {
        var headerRect = header.getBoundingClientRect()
        var headerTop = headerRect.top + window.scrollY
        var markerPosition = (headerTop / mainHeight) * 100
        markerPositions.push({ marker: marker, position: markerPosition })
      }
    })

    // 마커 위치 조정
    markerPositions.sort(function (a, b) {
      return a.position - b.position
    })

    for (var i = 1; i < markerPositions.length; i++) {
      var previousMarker = markerPositions[i - 1]
      var currentMarker = markerPositions[i]

      if (currentMarker.position - previousMarker.position < minSpacing) {
        currentMarker.position = previousMarker.position + minSpacing
      }
    }

    // 전체 공간을 10%~90% 범위로 변환
    var minPosition = minSpacing / 2
    var maxPosition = 100 - minSpacing
    var totalRange = maxPosition - minPosition
    var totalMarkerHeight =
      markerPositions[markerPositions.length - 1].position -
      markerPositions[0].position

    markerPositions.forEach(function (markerObj) {
      var relativePosition =
        (markerObj.position - markerPositions[0].position) / totalMarkerHeight
      markerObj.marker.style.top =
        minPosition + relativePosition * totalRange + "%"
    })

    // 활성화된 마커 업데이트
    updateActiveMarkers()
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
  }

  // 초기 마커 위치 및 크기 업데이트
  updateMarkerPositions()

  // 스크롤 시 마커 위치 및 크기 업데이트
  window.addEventListener("scroll", updateMarkerPositions)

  // 리사이즈 시 마커 위치 및 크기 업데이트
  window.addEventListener("resize", updateMarkerPositions)

  // 스크롤 네비게이션에 마우스를 올릴 때 툴팁 표시
  scrollNav.addEventListener("mouseenter", function () {
    markers.forEach(function (marker) {
      if (marker) {
        marker.classList.add("show-tooltip")
      }
    })
  })

  // 스크롤 네비게이션에서 마우스를 뗄 때 툴팁 숨기기
  scrollNav.addEventListener("mouseleave", function () {
    markers.forEach(function (marker) {
      if (marker) {
        marker.classList.remove("show-tooltip")
      }
    })
  })
})
