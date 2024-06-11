document.addEventListener("DOMContentLoaded", function () {
  const tables = document.querySelectorAll(".table-wrapper table")

  tables.forEach((table) => {
    mergeCells(table)

    table.querySelectorAll("th, td").forEach((cell) => {
      cell.addEventListener("mouseover", () => highlightRowCol(table, cell))
      cell.addEventListener("mouseout", () => removeHighlights(table))
    })

    fixedBorders(table)
  })

  function mergeCells(table) {
    const rows = Array.from(table.rows)
    rows.forEach((row, rowIndex) => {
      Array.from(row.cells).forEach((cell, colIndex) => {
        if (cell.hasAttribute("row-merged") || cell.hasAttribute("col-merged"))
          return

        if ((normalizeText(cell) !== "") ||
        (normalizeText(cell) !== "<") ||
        (normalizeText(cell) !== "^")) {
          let rowSpan = 1
          while (
            rowIndex + rowSpan < rows.length &&
            (normalizeText(rows[rowIndex + rowSpan].cells[colIndex]) === "" ||
            normalizeText(rows[rowIndex + rowSpan].cells[colIndex]) === "^")
          ) {
            rows[rowIndex + rowSpan].cells[colIndex].setAttribute(
              "row-merged",
              rowSpan
            )
            rowSpan++
          }
          if (rowSpan > 1) cell.rowSpan = rowSpan

          let colSpan = 1
          while (
            colIndex + colSpan < row.cells.length &&
            (normalizeText(row.cells[colIndex + colSpan]) === "" ||
            normalizeText(row.cells[colIndex + colSpan]) === "<")
          ) {
            row.cells[colIndex + colSpan].setAttribute("col-merged", colSpan)
            colSpan++
          }
          if (colSpan > 1) cell.colSpan = colSpan
        }
      })
    })
  }

  function highlightRowCol(table, cell) {
    const rowIndex = cell.parentNode.rowIndex
    const colIndex = cell.cellIndex
    const cur_rowSpan = cell.rowSpan
    const cur_colSpan = cell.colSpan

    const row = table.rows[rowIndex]
    for (let i = 0; i < row.cells.length; i++) {
      row.cells[i].classList.add("highlight-row")

      if (row.cells[i].hasAttribute("row-merged")) {
        const mergedOffset =
          parseInt(row.cells[i].getAttribute("row-merged"), 10) || 0
        const mergedRowIndex = rowIndex - mergedOffset
        table.rows[mergedRowIndex].cells[i].classList.add("highlight-row")
      }
    }

    for (let i = 0; i < table.rows.length; i++) {
      const cell = table.rows[i].cells[colIndex]
      if (cell) {
        cell.classList.add("highlight-col")
      }

      if (cell.hasAttribute("col-merged")) {
        const mergedOffset = parseInt(cell.getAttribute("col-merged"), 10) || 0
        const mergedColIndex = colIndex - mergedOffset
        table.rows[i].cells[mergedColIndex].classList.add("highlight-col")
      }
    }

    cell.classList.add("highlight-cell")
    rowspanHighlights(cur_rowSpan, table, rowIndex)
    colspanHighlights(cur_colSpan, table, colIndex)
  }

  function rowspanHighlights(rowSpan, table, rowIndex) {
    if (rowSpan > 1) {
      for (let i = 1; i < rowSpan; i++) {
        const highlightRow = table.rows[rowIndex + i]
        for (let j = 0; j < highlightRow.cells.length; j++) {
          highlightRow.cells[j].classList.add("highlight-row")
        }
      }
    }
  }

  function colspanHighlights(colSpan, table, colIndex) {
    if (colSpan > 1) {
      for (let i = 0; i < table.rows.length; i++) {
        const highlightRow = table.rows[i]
        for (let j = colIndex + 1; j < colIndex + colSpan; j++) {
          const highlightCell = highlightRow.cells[j]
          if (highlightCell) {
            highlightCell.classList.add("highlight-col")
          }
        }
      }
    }
  }

  function removeHighlights(table) {
    table
      .querySelectorAll(".highlight-row, .highlight-col, .highlight-cell")
      .forEach((cell) => {
        cell.classList.remove(
          "highlight-row",
          "highlight-col",
          "highlight-cell"
        )
      })
  }

  function normalizeText(cell) {
    return cell.textContent.replace(/\u00A0| |\s+/g, "").trim()
  }

  function fixedBorders(table) {
    const rows = Array.from(table.querySelectorAll("tbody tr"))
    const columnRowSpan = Array.from({ length: rows[0].cells.length }).fill(0)

    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.cells)

      cells.forEach((cell, cellIndex) => {
        const rowSpan = cell.rowSpan
        const actualLastRowIndex = rowIndex + rowSpan - 1

        if (actualLastRowIndex === rows.length - 1) {
          cell.style.borderBottom = "0"
        }

        if (cellIndex === 0 && columnRowSpan[cellIndex] <= rowIndex) {
          cell.style.borderLeft = "0"
        }
        columnRowSpan[cellIndex] = Math.max(
          columnRowSpan[cellIndex],
          rowIndex + rowSpan
        )
      })
    })
  }
})
