document.addEventListener("DOMContentLoaded", function () {
  initializeCanvas(
    "autosarCanvas",
    autosarLayerInit,
    { cols: 8, rows: 6, gap: 5 },
    { type: "autosar" }
  )
  initializeCanvas(
    "aspiceCanvasSys",
    aspiceLayerInit,
    { cols: 6, rows: 12, gap: 5 },
    { type: "aspice", typeDetail: "sys", lang: "kor" }
  )
  initializeCanvas(
    "aspiceCanvasSwe",
    aspiceLayerInit,
    { cols: 6, rows: 12, gap: 5 },
    { type: "aspice", typeDetail: "swe", lang: "kor" }
  )
  initializeCanvas(
    "aspiceCanvas",
    aspiceLayerInit,
    { cols: 6, rows: 12, gap: 5 },
    { type: "aspice", lang: "kor" }
  )
  initializeCanvas(
    "isoCanvas",
    isoLayerInit,
    { cols: 6, rows: 12, gap: 5 },
    { type: "iso" }
  ) // Assuming default values for isoCanvas
})

function initializeCanvas(
  canvasId,
  layerInitFunction,
  { cols, rows, gap },
  { type, typeDetail = "default", lang }
) {
  const canvas = document.getElementById(canvasId)
  if (canvas) {
    const ctx = canvas.getContext("2d")

    const colsMargin = rows * gap
    const rowsMargin = cols * gap

    var fixedHeights
    var fixedWidths
    var gridWidths
    var gridHeights
    var dynamicFontSize
    var drawLayersFunction
    var layers = {
      layerGroups: null,
      layerGroupDetails: null,
      layerGroupDetailDetails: null,
    }

    resizeCanvas()

    function calculateGridWidths(canvasWidth) {
      const totalFixedWidth = Object.values(fixedWidths).reduce(
        (a, b) => a + b,
        0
      )
      const remainingWidth =
        canvasWidth - totalFixedWidth - (cols - 1) * gap - colsMargin
      const numDynamicCols = cols - Object.keys(fixedWidths).length
      const dynamicColWidth = remainingWidth / numDynamicCols
      return Array.from(
        { length: cols },
        (_, i) => fixedWidths[i + 1] || dynamicColWidth
      )
    }

    function calculateGridHeights(canvasHeight) {
      const totalFixedHeight = Object.values(fixedHeights).reduce(
        (a, b) => a + b,
        0
      )
      const remainingHeight =
        canvasHeight - totalFixedHeight - (rows - 1) * gap - rowsMargin
      const numDynamicRows = rows - Object.keys(fixedHeights).length
      const dynamicRowHeight = remainingHeight / numDynamicRows
      return Array.from(
        { length: rows },
        (_, i) => fixedHeights[i + 1] || dynamicRowHeight
      )
    }

    function canvasInit() {
      const fixedCanvasWidth = canvas.width - rowsMargin
      const fixedCanvasHeight = canvas.height - colsMargin
      if (type === "autosar") {
        fixedWidths = {
          2: fixedCanvasHeight * (1 / 4),
          5: fixedCanvasHeight * (1 / 4),
          6: fixedCanvasHeight * (1 / 4),
        }
        fixedHeights = {
          1: fixedCanvasWidth * (1 / 10),
          2: fixedCanvasWidth * (1 / 25),
          6: fixedCanvasWidth * (1 / 10),
        }
        drawLayersFunction = drawAutosarLayers
      } else if (type === "aspice") {
        fixedWidths = {
          6: fixedCanvasHeight * (1 / 3),
        }
        fixedHeights = {
          12: fixedCanvasWidth * (1 / 36),
        }
        drawLayersFunction = drawAspiceLayers
      } else if (type === "iso") {
        fixedWidths = {
          8: fixedCanvasHeight * (1 / 4),
        }
        fixedHeights = {
          16: fixedCanvasWidth * (1 / 48),
        }
        drawLayersFunction = drawIsoLayers
      }

      gridWidths = calculateGridWidths(canvas.width)
      gridHeights = calculateGridHeights(canvas.height)
      dynamicFontSize = (size) => `${(fixedCanvasWidth * size) / 1000}px`
    }

    function resizeCanvas() {
      const container = document.querySelector(".canvas-container")
      canvas.width = container.clientWidth
      canvas.height = container.clientWidth * (9 / 16)

      canvasInit()
      layers = layerInitFunction(dynamicFontSize, typeDetail, lang)
      drawLayersFunction(layers)
    }

    function drawAutosarLayers(
      { layerGroups, layerGroupDetails, layerGroupDetailDetails },
      useICC2,
      hoverLayer = null
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
      layerGroups.forEach((layer) => {
        // layersICC1
        if (!useICC2 || !layerGroupDetails[layer.name]) {
          drawLayer(layer, ctx)
        } else {
          layerGroupDetails[layer.name].forEach((subLayer) => {
            // layersICC2 layersICC3
            if (
              !hoverLayer ||
              hoverLayer.name !== subLayer.name ||
              !layerGroupDetailDetails[subLayer.name]
            ) {
              drawLayer(subLayer, ctx)
            } else {
              layerGroupDetailDetails[subLayer.name].forEach((detailLayer) =>
                drawLayer(detailLayer, ctx)
              )
            }
          })
        }
      })
    }

    function drawAspiceLayers({ layerGroups, layerGroupDetails }) {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
      layerGroups.forEach((layer) => {
        drawLayer(layer, ctx)
        if (layerGroupDetails[layer.name]) {
          layerGroupDetails[layer.name].forEach((subLayer) =>
            drawLayer(subLayer, ctx)
          )
        }
      })
    }

    function drawIsoLayers({ layerGroups, layerGroupDetails }) {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
      // Iso-specific drawing logic here
      // You can use the same logic as drawAspiceLayers or customize as needed
      layerGroups.forEach((layer) => {
        drawLayer(layer, ctx)
        if (layerGroupDetails[layer.name]) {
          layerGroupDetails[layer.name].forEach((subLayer) =>
            drawLayer(subLayer, ctx)
          )
        }
      })
    }

    function drawLayer(layer, ctx) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity

      layer.cells.forEach((cell, index) => {
        const x = gridWidths
          .slice(0, cell.x)
          .reduce(
            (acc, width, idx) => acc + width + (idx < cell.x ? gap : 0),
            20 +
              (type == "aspice" && layer.detail ? gap : 0) +
              (type == "aspice" && cell.a !== undefined
                ? canvas.width * cell.a
                : 0)
          )
        const y = gridHeights
          .slice(0, cell.y)
          .reduce(
            (acc, height, idx) => acc + height + (idx < cell.y ? gap : 0),
            20 - (type == "aspice" && layer.detail ? gap : 0)
          )
        const width =
          gridWidths
            .slice(cell.x, cell.x + cell.w)
            .reduce(
              (acc, width) => acc + width,
              0 - (type == "aspice" && layer.detail ? gap * 2 : 0)
            ) +
          (cell.w - 1) * gap
        const height =
          gridHeights
            .slice(cell.y, cell.y + cell.h)
            .reduce((acc, height) => acc + height, 0) +
          (cell.h - 1) * gap

        ctx.fillStyle = layer.color
        ctx.fillRect(x, y, width, height)

        if (type == "aspice") {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x + width)
          maxY = Math.max(maxY, y + height)
        }

        if (index === layer.cells.length - 1) {
          ctx.fillStyle = layer.textColor
          ctx.textAlign = "center"
          let nameY

          if (type == "aspice") {
            nameY =
              y +
              (layer.cells.length > 1
                ? (parseInt(layer.fontSize) * 3) / 2
                : parseInt(layer.fontSize))
            const detailY = y + (height * 2) / 3

            if (layer.detail) {
              ctx.font = `${layer.fontOption} ${layer.detailFontSize} ${layer.fontType}`
              wrapText(
                ctx,
                layer.detail,
                x + width / 2,
                detailY,
                width - 10,
                parseInt(layer.detailFontSize)
              )
              nameY = y + parseInt(layer.detailFontSize)
            }
          }

          ctx.font = `${layer.fontOption} ${layer.fontSize} ${layer.fontType}`
          wrapText(
            ctx,
            layer.name,
            x + width / 2,
            type == "aspice" ? nameY : y + height / 2,
            width - 10,
            parseInt(layer.fontSize)
          )
        }
      })

      if (type == "aspice") {
        ctx.strokeStyle = "black"
        ctx.lineWidth = 1
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
      }
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      const words = text.split(" ")
      const lines = []
      let line = ""

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        const metrics = context.measureText(testLine)
        const testWidth = metrics.width
        if (testWidth > maxWidth && n > 0) {
          lines.push(line)
          line = words[n] + " "
        } else {
          line = testLine
        }
      }
      if (line !== "") lines.push(line.trim())

      const totalTextHeight = (lines.length - 1) * lineHeight
      const startY = y + 0.4 * lineHeight - 0.5 * totalTextHeight

      lines.forEach((ln, idx) => {
        const lineY = startY + idx * lineHeight
        context.fillText(ln, x, lineY)
      })
    }

    function handleMouseMove(event) {
      const x = event.clientX - canvas.getBoundingClientRect().left
      const y = event.clientY - canvas.getBoundingClientRect().top
      let hoverOnICC2 = true
      let hoverLayer = null

      // Determine if hovering on ICC2 layers
      Object.keys(layers.layerGroupDetails).forEach((key) => {
        layers.layerGroupDetails[key].forEach((layer) => {
          if (layer.cells.some((cell) => isMouseInsideLayer(x, y, cell))) {
            hoverLayer = layer
          }
        })
      })

      drawLayersFunction(layers, hoverOnICC2, hoverLayer)
    }

    function handleMouseEnter() {
      drawLayersFunction(layers)
      canvas.addEventListener("mousemove", handleMouseMove)
    }

    function handleMouseLeave() {
      canvas.removeEventListener("mousemove", handleMouseMove)
      drawLayersFunction(layers)
    }

    function handleMouseClick(event) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Helper function to handle URL navigation
      function navigateToUrl(url) {
        if (url) {
          if (url.startsWith("#")) {
            window.location.href =
              `${window.location.origin}/` +
              url
                .toLowerCase()
                .replace(/([\s])|([\(\)\/])/g, (match, p1, p2) => {
                  if (p1) {
                    return "-"
                  } else if (p2) {
                    return ""
                  }
                  return `${match}`
                })
          } else {
            window.location.href =
              `${window.location.origin}/` + url.replace(/\s/g, "-")
          }
        }
      }

      if (layers.layerGroups != null) {
        layers.layerGroups.some((layer) => {
          if (layer.cells.some((cell) => isMouseInsideLayer(x, y, cell))) {
            navigateToUrl(layer.url)
            return true
          }
        })
      }

      if (layers.layerGroupDetails != null) {
        Object.keys(layers.layerGroupDetails).some((key) => {
          return layers.layerGroupDetails[key].some((layer) => {
            if (layer.cells.some((cell) => isMouseInsideLayer(x, y, cell))) {
              navigateToUrl(layer.url)
              return true
            }
          })
        })
      }

      if (layers.layerGroupDetailDetails != null) {
        Object.keys(layers.layerGroupDetailDetails).some((key) => {
          return layers.layerGroupDetailDetails[key].some((layer) => {
            if (layer.cells.some((cell) => isMouseInsideLayer(x, y, cell))) {
              navigateToUrl(layer.url)
              return true
            }
          })
        })
      }
    }

    function isMouseInsideLayer(x, y, cell) {
      const cellX =
        gridWidths
          .slice(0, cell.x)
          .reduce(
            (acc, width, idx) => acc + width + (idx < cell.x ? gap * idx : 0),
            20
          ) -
        gap +
        (cell.a !== undefined ? canvas.width * cell.a : 0)
      const cellY =
        gridHeights
          .slice(0, cell.y)
          .reduce(
            (acc, height, idx) =>
              acc +
              height +
              (idx < cell.y ? (type == "autosar" ? gap * idx : gap) : 0),
            20
          ) - gap
      const cellWidth =
        gridWidths
          .slice(cell.x, cell.x + cell.w)
          .reduce((acc, width) => acc + width, 0) +
        (cell.w - 1) * (type == "autosar" ? gap + 1 : gap)
      const cellHeight =
        gridHeights
          .slice(cell.y, cell.y + cell.h)
          .reduce((acc, height) => acc + height, 0) +
        (cell.h - 1) * (type == "autosar" ? gap + 1 : gap)

      return (
        x >= cellX &&
        x <= cellX + cellWidth &&
        y >= cellY &&
        y <= cellY + cellHeight
      )
    }

    switch (type) {
      case "autosar":
        canvas.addEventListener("mouseenter", handleMouseEnter)
        canvas.addEventListener("mouseleave", handleMouseLeave)
        canvas.addEventListener("click", handleMouseClick)
        break
      case "aspice":
        canvas.addEventListener("click", handleMouseClick)
        break
      default:
        break
    }
    window.addEventListener("resize", resizeCanvas)
  }
}

function autosarLayerInit(dynamicFontSize) {
  const baseStyle = {
    fontOption: "bold",
    fontType: "Arial",
  }

  const layerColors = {
    application: "#4D4D4D",
    rte: "#FF5008",
    services: "#9999FF",
    abstraction: "#00CC99",
    bsw: "#00CC99",
    drivers: "#FF7C80",
    mcu: "#000000",
  }

  const textColors = {
    white: "#FFFFFF",
    black: "#000000",
  }

  const icc3Style = {
    textColor: textColors.black,
    fontSize: dynamicFontSize(16),
    ...baseStyle,
  }

  layersICC1 = [
    {
      name: "Application Layer",
      color: layerColors.application,
      textColor: textColors.white,
      fontSize: dynamicFontSize(24),
      cells: [{ x: 0, y: 0, w: 8, h: 1 }],
      url: "#Application Layer (Application)",
    },
    {
      name: "AUTOSAR Runtime Environment (RTE)",
      color: layerColors.rte,
      textColor: textColors.white,
      fontSize: dynamicFontSize(24),
      cells: [{ x: 0, y: 1, w: 8, h: 1 }],
      url: "#AUTOSAR Runtime Environment (RTE)",
    },
    {
      name: "Basic Software (BSW)",
      color: layerColors.bsw,
      textColor: textColors.black,
      fontSize: dynamicFontSize(24),
      cells: [{ x: 0, y: 2, w: 8, h: 3 }],
      url: "#Basic Software (BSW)",
    },
    {
      name: "Microcontroller",
      color: layerColors.mcu,
      textColor: textColors.white,
      fontSize: dynamicFontSize(24),
      cells: [{ x: 0, y: 5, w: 8, h: 1 }],
      url: "#Microcontroller (Hardware)",
    },
  ].map((layer) => ({ ...layer, ...baseStyle }))

  layersICC2 = {
    "Basic Software (BSW)": [
      {
        name: "Services Layer",
        color: layerColors.services,
        textColor: textColors.black,
        fontSize: dynamicFontSize(20),
        cells: [
          { x: 0, y: 2, w: 3, h: 1 },
          { x: 0, y: 2, w: 1, h: 3 },
          { x: 2, y: 2, w: 4, h: 1 },
        ],
        url: "#Services Layer",
      },
      {
        name: "ECU Abstraction Layer",
        color: layerColors.abstraction,
        textColor: textColors.black,
        fontSize: dynamicFontSize(20),
        cells: [
          { x: 6, y: 2, w: 1, h: 2 },
          { x: 1, y: 3, w: 6, h: 1 },
        ],
        url: "#ECU Abstraction Layer",
      },
      {
        name: "Complex Drivers",
        color: layerColors.bsw,
        textColor: textColors.black,
        fontSize: dynamicFontSize(20),
        cells: [{ x: 7, y: 2, w: 1, h: 3 }],
        url: "#Complex Drivers",
      },
      {
        name: "Microcontroller Abstraction Layer",
        color: layerColors.drivers,
        textColor: textColors.black,
        fontSize: dynamicFontSize(20),
        cells: [{ x: 1, y: 4, w: 6, h: 1 }],
        url: "#Microcontroller Abstraction Layer",
      },
    ].map((layer) => ({ ...layer, ...baseStyle })),
  }

  layersICC3 = {
    "Services Layer": [
      {
        name: "System Services",
        color: layerColors.services,
        cells: [
          { x: 0, y: 2, w: 1, h: 3 },
          { x: 0, y: 2, w: 2, h: 1 },
        ],
        url: "#System Services",
      },
      {
        name: "Memory Services",
        color: layerColors.services,
        cells: [{ x: 2, y: 2, w: 1, h: 1 }],
        url: "#Memory Services",
      },
      {
        name: "Crypto Services",
        color: layerColors.services,
        cells: [{ x: 3, y: 2, w: 1, h: 1 }],
        url: "#Crypto Services",
      },
      {
        name: "Off-board Communication Services",
        color: layerColors.services,
        cells: [{ x: 4, y: 2, w: 1, h: 1 }],
        url: "#Off-board Communication Services",
      },
      {
        name: "Communication Services",
        color: layerColors.services,
        cells: [{ x: 5, y: 2, w: 1, h: 1 }],
        url: "#Communication Services",
      },
    ].map((layer) => ({ ...layer, ...icc3Style })),
    "ECU Abstraction Layer": [
      {
        name: "On-board Device Abstraction",
        color: layerColors.abstraction,
        cells: [{ x: 1, y: 3, w: 1, h: 1 }],
        url: "#On-board Device Abstraction",
      },
      {
        name: "Memory Hardware Abstraction",
        color: layerColors.abstraction,
        cells: [{ x: 2, y: 3, w: 1, h: 1 }],
        url: "#Memory Hardware Abstraction",
      },
      {
        name: "Crypto Hardware Abstraction",
        color: layerColors.abstraction,
        cells: [{ x: 3, y: 3, w: 1, h: 1 }],
        url: "#Crypto Hardware Abstraction",
      },
      {
        name: "Wireless Communication Abstraction",
        color: layerColors.abstraction,
        cells: [{ x: 4, y: 3, w: 1, h: 1 }],
        url: "#Wireless Communication Abstraction",
      },
      {
        name: "Communication Hardware Abstraction",
        color: layerColors.abstraction,
        cells: [{ x: 5, y: 3, w: 1, h: 1 }],
        url: "#Communication Hardware Abstraction",
      },
      {
        name: "I/O Hardware Abstraction",
        color: layerColors.abstraction,
        cells: [{ x: 6, y: 2, w: 1, h: 2 }],
        url: "#IO Hardware Abstraction",
      },
    ].map((layer) => ({ ...layer, ...icc3Style })),
    "Microcontroller Abstraction Layer": [
      {
        name: "Microcontroller Drivers",
        color: layerColors.drivers,
        cells: [{ x: 1, y: 4, w: 1, h: 1 }],
        url: "#Microcontroller Drivers",
      },
      {
        name: "Memory Drivers",
        color: layerColors.drivers,
        cells: [{ x: 2, y: 4, w: 1, h: 1 }],
        url: "#Memory Drivers",
      },
      {
        name: "Crypto Drivers",
        color: layerColors.drivers,
        cells: [{ x: 3, y: 4, w: 1, h: 1 }],
        url: "#Crypto Drivers",
      },
      {
        name: "Wireless Communication Drivers",
        color: layerColors.drivers,
        cells: [{ x: 4, y: 4, w: 1, h: 1 }],
        url: "#Wireless Communication Drivers",
      },
      {
        name: "Communication Drivers",
        color: layerColors.drivers,
        cells: [{ x: 5, y: 4, w: 1, h: 1 }],
        url: "#Communication Drivers",
      },
      {
        name: "I/O Drivers",
        color: layerColors.drivers,
        cells: [{ x: 6, y: 4, w: 1, h: 1 }],
        url: "#IO Drivers",
      },
    ].map((layer) => ({ ...layer, ...icc3Style })),
  }

  return {
    layerGroups: layersICC1,
    layerGroupDetails: layersICC2,
    layerGroupDetailDetails: layersICC3,
  }
}

function aspiceLayerInit(dynamicFontSize, type, lang) {
  const textColors = {
    white: "#FFFFFF",
    black: "#000000",
  }

  const baseStyle = {
    fontOption: "bold",
    fontType: "Arial",
    textColor: textColors.black,
  }

  const lifeCycleColors = {
    primary: "#F6C6AD",
    organizational: "#A6CAEC",
    supporting: "#B4E5A2",
    group: "#E8E8E8",
    disable: "#A3A3A3",
  }

  const textStyle = {
    fontSize: dynamicFontSize(14),
    detailFontSize: lang === "kor" ? dynamicFontSize(11) : dynamicFontSize(10),
    ...baseStyle,
  }

  layerGroups = [
    {
      name: "Acquisition Process Group (ACQ)",
      color: lifeCycleColors.primary,
      cells: [
        { x: 0, y: 0, w: 1, h: 8 },
        { x: 0, y: 0, w: 1, h: 1 },
      ],
    },
    {
      name: "System Engineering Process Group (SYS)",
      color: lifeCycleColors.primary,
      cells: [
        { x: 1, y: 0, w: 4, h: 4 },
        { x: 1, y: 0, w: 4, h: 1 },
      ],
    },
    {
      name: "Software Engineering Process Group (SWE)",
      color: lifeCycleColors.primary,
      cells: [
        { x: 1, y: 4, w: 4, h: 4 },
        { x: 1, y: 4, w: 4, h: 1 },
      ],
    },
    {
      name: "Supply Process Group (SPL)",
      color: lifeCycleColors.primary,
      cells: [
        { x: 0, y: 8, w: 1, h: 3 },
        { x: 0, y: 8, w: 1, h: 1 },
      ],
    },
    {
      name: "Supporting Process Group (SUP)",
      color: lifeCycleColors.supporting,
      cells: [
        { x: 1, y: 8, w: 4, h: 3 },
        { x: 1, y: 8, w: 4, h: 1 },
      ],
    },
    {
      name: "Management Process Group (MAN)",
      color: lifeCycleColors.organizational,
      cells: [
        { x: 5, y: 0, w: 1, h: 4 },
        { x: 5, y: 0, w: 1, h: 1 },
      ],
    },
    {
      name: "Reuse Process Group (REU)",
      color: lifeCycleColors.organizational,
      cells: [
        { x: 5, y: 7, w: 1, h: 2 },
        { x: 5, y: 7, w: 1, h: 1 },
      ],
    },
    {
      name: "Process Improvement Process Group (PIM)",
      color: lifeCycleColors.organizational,
      cells: [
        { x: 5, y: 9, w: 1, h: 2 },
        { x: 5, y: 9, w: 1, h: 1 },
      ],
    },
    {
      name: "Primary Life Cycle Processes",
      color: lifeCycleColors.primary,
      cells: [{ x: 0, y: 11, w: 2, h: 1 }],
    },
    {
      name: "Organizational Life Cycle Processes",
      color: lifeCycleColors.organizational,
      cells: [{ x: 2, y: 11, w: 2, h: 1 }],
    },
    {
      name: "Supporting Life Cycle Processes",
      color: lifeCycleColors.supporting,
      cells: [{ x: 4, y: 11, w: 2, h: 1 }],
    },
  ].map((layer) => ({ ...layer, ...textStyle }))

  layerGroupDetails = {
    "Acquisition Process Group (ACQ)": [
      {
        name: "ACQ. 3",
        detail: lang === "kor" ? "계약 협약" : "Contract Agreement",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 1, w: 1, h: 1 }],
      },
      {
        name: "ACQ. 4",
        detail: lang === "kor" ? "협력 업체 모니터링" : "Supplier Monitoring",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 2, w: 1, h: 1 }],
      },
      {
        name: "ACQ. 11",
        detail: lang === "kor" ? "기술 요구사항" : "Technical Requirements",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 3, w: 1, h: 1 }],
      },
      {
        name: "ACQ. 12",
        detail:
          lang === "kor"
            ? "법, 행정 요구사항"
            : "Legal and Administrative Requirements",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 4, w: 1, h: 1 }],
      },
      {
        name: "ACQ. 13",
        detail: lang === "kor" ? "프로젝트 요구사항" : "Project Requirements",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 5, w: 1, h: 1 }],
      },
      {
        name: "ACQ. 14",
        detail: lang === "kor" ? "제안 요청" : "Request for Proposals",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 6, w: 1, h: 1 }],
      },
      {
        name: "ACQ. 15",
        detail:
          lang === "kor" ? "협력 업체 자격 요건" : "Supplier Qualification",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 7, w: 1, h: 1 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "Supply Process Group (SPL)": [
      {
        name: "SPL. 1",
        detail: lang === "kor" ? "협력 업체 입찰" : "Supplier Tendering",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 9, w: 1, h: 1 }],
      },
      {
        name: "SPL. 2",
        detail: lang === "kor" ? "제품 출시" : "Product Release",
        color: lifeCycleColors.group,
        cells: [{ x: 0, y: 10, w: 1, h: 1 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "Supporting Process Group (SUP)": [
      {
        name: "SUP. 1",
        detail: lang === "kor" ? "품질 보증" : "Supplier Tendering",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 9, w: 1, h: 1 }],
      },
      {
        name: "SUP. 2",
        detail: lang === "kor" ? "검증" : "Verification",
        color: lifeCycleColors.group,
        cells: [{ x: 2, y: 9, w: 1, h: 1 }],
      },
      {
        name: "SUP. 4",
        detail: lang === "kor" ? "협동 검토" : "Joint Review",
        color: lifeCycleColors.group,
        cells: [{ x: 3, y: 9, w: 1, h: 1 }],
      },
      {
        name: "SUP. 7",
        detail: lang === "kor" ? "문서화" : "Documentation",
        color: lifeCycleColors.group,
        cells: [{ x: 4, y: 9, w: 1, h: 1 }],
      },
      {
        name: "SUP. 8",
        detail: lang === "kor" ? "형상 관리" : "Configuration Management",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 10, w: 1, h: 1 }],
      },
      {
        name: "SUP. 9",
        detail:
          lang === "kor" ? "문제 해결 관리" : "Problem Resolution Management",
        color: lifeCycleColors.group,
        cells: [{ x: 2, y: 10, w: 1, h: 1 }],
      },
      {
        name: "SUP. 10",
        detail: lang === "kor" ? "변경 요청 관리" : "Change Request Management",
        color: lifeCycleColors.group,
        cells: [{ x: 3, y: 10, w: 1, h: 1 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "Management Process Group (MAN)": [
      {
        name: "MAN. 3",
        detail: lang === "kor" ? "프로젝트 관리" : "Project Management",
        color: lifeCycleColors.group,
        cells: [{ x: 5, y: 1, w: 1, h: 1 }],
      },
      {
        name: "MAN. 5",
        detail: lang === "kor" ? "위험관리" : "Risk Management",
        color: lifeCycleColors.group,
        cells: [{ x: 5, y: 2, w: 1, h: 1 }],
      },
      {
        name: "MAN. 6",
        detail: lang === "kor" ? "측정" : "Measurement",
        color: lifeCycleColors.group,
        cells: [{ x: 5, y: 3, w: 1, h: 1 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "Reuse Process Group (REU)": [
      {
        name: "REU. 2",
        detail:
          lang === "kor" ? "재사용 프로그램 관리" : "Reuse Program Management",
        color: lifeCycleColors.group,
        cells: [{ x: 5, y: 8, w: 1, h: 1 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "Process Improvement Process Group (PIM)": [
      {
        name: "PIM. 3",
        detail: lang === "kor" ? "프로세스 개선" : "Reuse Program Management",
        color: lifeCycleColors.group,
        cells: [{ x: 5, y: 10, w: 1, h: 1 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "System Engineering Process Group (SYS)": [
      {
        name: "SYS. 1",
        detail: lang === "kor" ? "요구사항 도출" : "Requirements Elicitation",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 1, w: 1, h: 1 }],
      },
      {
        name: "SYS. 2",
        detail:
          lang === "kor"
            ? "시스템 요구사항 분석"
            : "System Requirements Analysis",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 2, w: 1, h: 1, a: 0.05 }],
        url:
          type === "sys" || type === "default"
            ? "4-_System_Engineering_Process_(SYS)/4-1-_SYS-2_(System_Requirements_Analysis)"
            : null,
      },
      {
        name: "SYS. 3",
        detail:
          lang === "kor"
            ? "시스템 아키텍처 설계"
            : "System Architectural Design",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 3, w: 1, h: 1, a: 0.1 }],
        url:
          type === "sys" || type === "default"
            ? "4-_System_Engineering_Process_(SYS)/4-2-_SYS-3_(System_Architectural_Design)"
            : null,
      },
      {
        name: "SYS. 4",
        detail:
          lang === "kor"
            ? "시스템 통합 및 통합 테스트"
            : "System Integration and Integration Test",
        color: lifeCycleColors.group,
        cells: [{ x: 4, y: 3, w: 1, h: 1, a: -0.1 }],
      },
      {
        name: "SYS. 5",
        detail:
          lang === "kor" ? "시스템 자격 테스트" : "System Qualification Test",
        color: lifeCycleColors.group,
        cells: [{ x: 4, y: 2, w: 1, h: 1, a: -0.05 }],
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
    "Software Engineering Process Group (SWE)": [
      {
        name: "SWE. 1",
        detail:
          lang === "kor"
            ? "SW 요구사항 분석"
            : "Software Requirements Analysis",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 5, w: 1, h: 1, a: 0.05 }],
        url:
          type === "swe" || type === "default"
            ? "5-_Software_Engineering_Process_(SWE)/5-1-_SWE-1_(Software_Requirements_Analysis)"
            : null,
      },
      {
        name: "SWE. 2",
        detail:
          lang === "kor" ? "SW 아키텍처 설계" : "Software Architectural Design",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 6, w: 1, h: 1, a: 0.1 }],
        url:
          type === "swe" || type === "default"
            ? "5-_Software_Engineering_Process_(SWE)/5-2-_SWE-2_(Software_Architectural_Design)"
            : null,
      },
      {
        name: "SWE. 3",
        detail:
          lang === "kor"
            ? "SW 상세 설계 / 단위 구현"
            : "Software Detailed Design and Unit Construction",
        color: lifeCycleColors.group,
        cells: [{ x: 1, y: 7, w: 1, h: 1, a: 0.15 }],
        url:
          type === "swe" || type === "default"
            ? "5-_Software_Engineering_Process_(SWE)/5-3-_SWE-3_(Software_Detailed_Design)"
            : null,
      },
      {
        name: "SWE. 4",
        detail: lang === "kor" ? "SW 단위 검증" : "Software Unit Verification",
        color: lifeCycleColors.group,
        cells: [{ x: 4, y: 7, w: 1, h: 1, a: -0.15 }],
        url:
          type === "swe" || type === "default"
            ? "5-_Software_Engineering_Process_(SWE)/5-4-_SWE-4_(Software_Unit_Verification)"
            : null,
      },
      {
        name: "SWE. 5",
        detail:
          lang === "kor"
            ? "SW 통합 및 테스트"
            : "Software Integration and Integration Test",
        color: lifeCycleColors.group,
        cells: [{ x: 4, y: 6, w: 1, h: 1, a: -0.1 }],
        url:
          type === "swe" || type === "default"
            ? "5-_Software_Engineering_Process_(SWE)/5-5-_SWE-5_(Software_Integration_Test)"
            : null,
      },
      {
        name: "SWE. 6",
        detail:
          lang === "kor" ? "SW 자격 테스트" : "Software Qualification Test",
        color: lifeCycleColors.group,
        cells: [{ x: 4, y: 5, w: 1, h: 1, a: -0.05 }],
        url:
          type === "swe" || type === "default"
            ? "5-_Software_Engineering_Process_(SWE)/5-6-_SWE-6_(Software_Qualification_Test)"
            : null,
      },
    ].map((layer) => ({
      ...layer,
      ...textStyle,
      color: layer.url ? lifeCycleColors.group : lifeCycleColors.disable,
    })),
  }
  return { layerGroups, layerGroupDetails, layerGroupDetailDetails: null }
}

function isoLayerInit(dynamicFontSize) {
  // Initialize ISO specific layers
  return { layerGroups, layerGroupDetails, layerGroupDetailDetails: null }
}
