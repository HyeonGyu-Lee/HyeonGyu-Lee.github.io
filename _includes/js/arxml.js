document.addEventListener("DOMContentLoaded", function () {
  const arxmlElement = document.querySelector(".arxml")
  if (arxmlElement) {
    const shortNameToFind = arxmlElement.getAttribute("id")
    const filePath = arxmlElement.getAttribute("data-files")
    const baseUrl = window.location.origin
    const fullPath = new URL(filePath, baseUrl).href

    fetch(fullPath)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data, "application/xml")
        const ecucModules = xmlDoc.querySelectorAll("ECUC-MODULE-DEF")

        ecucModules.forEach((module) => {
          const shortName = module.querySelector(":scope > SHORT-NAME")
          if (shortName && shortName.textContent === shortNameToFind) {
            const tree = createTree(module, shortNameToFind)
            document.getElementById("arxmlContent").appendChild(tree)
          }
        })
      })
      .catch((error) => console.error("Error fetching the ARXML file:", error))
  }
})

function getExceptionList(id) {
  const exceptionLists = {
    Dcm: {
      tree: [
        "SHORT-NAME",
        "DESC",
        "ADMIN-DATA",
        "LOWER-MULTIPLICITY",
        "UPPER-MULTIPLICITY",
        "UPPER-MULTIPLICITY-INFINITE",
        "POST-BUILD-VARIANT-SUPPORT",
        "SUPPORTED-CONFIG-VARIANTS",
        "RELATED-TRACE-ITEM-REF",
        "SCOPE",
        "ORIGIN",
        "POST-BUILD-VARIANT-VALUE",
        "VALUE-CONFIG-CLASSES",
        "SYMBOLIC-NAME-VALUE",
        "REFERENCES",
        "INTRODUCTION",
        "MULTIPLICITY-CONFIG-CLASSES",
        "POST-BUILD-VARIANT-MULTIPLICITY",
        "DEFAULT-VALUE",
        "MAX",
        "MIN",
        "ECUC-STRING-PARAM-DEF-VARIANTS",
        "ECUC-FUNCTION-NAME-DEF-VARIANTS",
        "LITERALS",
      ],
      node: ["CONTAINERS", "PARAMETERS"],
      detail: [
        "ECUC-MODULE-DEF",
        "CONTAINERS",
        "ECUC-PARAM-CONF-CONTAINER-DEF",
        "SUB-CONTAINERS",
        "SHORT-NAME",
      ],
    },
    // 다른 id에 대한 예외 목록을 추가할 수 있습니다.
  }
  return exceptionLists[id] || { tree: [], detail: [] }
}

function createTree(xmlNode, id, level = 0) {
  const ul = document.createElement("ul")
  ul.style.listStyleType = "none"
  ul.style.marginLeft = `${level * 2}px`

  const li = document.createElement("li")
  const span = document.createElement("span")
  const { tree: treeExceptions, node: nodeExceptions } = getExceptionList(id)

  const hasChildElements = Array.from(xmlNode.childNodes).some(
    (childNode) =>
      childNode.nodeType === Node.ELEMENT_NODE &&
      !treeExceptions.includes(childNode.nodeName)
  )

  if (hasChildElements) {
    const toggleBtn = document.createElement("button")
    toggleBtn.classList.add("toggle-btn")
    toggleBtn.innerHTML =
      '<svg width="10" height="10" viewBox="0 0 20 20"><polygon points="0,0 10,10 0,20" /></svg>'
    span.appendChild(toggleBtn)

    toggleBtn.addEventListener("click", function () {
      const parentLi = this.parentElement.parentElement
      parentLi.classList.toggle("collapsed")
      this.classList.toggle("collapsed")
    })
  }

  const shortName = xmlNode.querySelector(":scope > SHORT-NAME")
  if (shortName) {
    const attrSpan = document.createElement("span")
    attrSpan.style.fontWeight = "bold"
    attrSpan.textContent = `${shortName.textContent}`
    span.appendChild(attrSpan)
    // span.appendChild(document.createTextNode(shortName.textContent))
  } else {
    const attrSpan = document.createElement("span")
    attrSpan.textContent = `${xmlNode.nodeName}`
    span.appendChild(attrSpan)
  }
  li.appendChild(span)

  if (!nodeExceptions.includes(xmlNode.nodeName)) {
    li.addEventListener("click", function (event) {
      event.stopPropagation()
      displayNodeDetails(xmlNode, id)
    })
  }

  ul.appendChild(li)

  xmlNode.childNodes.forEach((childNode) => {
    if (
      childNode.nodeType === Node.ELEMENT_NODE &&
      !treeExceptions.includes(childNode.nodeName)
    ) {
      const childTree = createTree(childNode, id, level + 1)
      li.appendChild(childTree)
    } else if (
      childNode.nodeType === Node.TEXT_NODE &&
      childNode.textContent.trim()
    ) {
      const textNode = document.createElement("span")
      textNode.textContent = `: ${childNode.textContent.trim()}`
      li.appendChild(textNode)
    }
  })

  return ul
}

function displayNodeDetails(xmlNode, id) {
  const detailsContainer = document.getElementById("nodeDetails")
  const treeContainer = document.querySelector(".tree-container")
  const { detail: detailExceptions } = getExceptionList(id)
  detailsContainer.innerHTML = ""

  // const nodeName = document.createElement("h3")
  // nodeName.textContent = xmlNode.querySelector(":scope > SHORT-NAME")
  //  ? xmlNode.querySelector(":scope > SHORT-NAME").textContent
  //  : xmlNode.nodeName

  const attrSpan = document.createElement("span")
  attrSpan.style.fontWeight = "bold"
  attrSpan.textContent = xmlNode.querySelector(":scope > SHORT-NAME")
    ? xmlNode.querySelector(":scope > SHORT-NAME").textContent
    : xmlNode.nodeName

  detailsContainer.appendChild(attrSpan)

  const list = document.createElement("ul")
  Array.from(xmlNode.children).forEach((child) => {
    if (!detailExceptions.includes(child.nodeName)) {
      if (child.nodeName === "PARAMETERS") {
        const item = document.createElement("li")
        const combo = document.createElement("select")
        Array.from(child.children).forEach((param) => {
          const shortNameElement = param.querySelector(":scope > SHORT-NAME")
          if (shortNameElement) {
            const option = document.createElement("option")
            option.textContent = shortNameElement.textContent
            combo.appendChild(option)
          }
        })
        const attrSpan = document.createElement("span")
        attrSpan.style.fontWeight = "bold"
        attrSpan.textContent = `${child.nodeName}: `
        item.appendChild(attrSpan)
        item.appendChild(combo)
        list.appendChild(item)
      } else {
        const item = document.createElement("li")

        const attrSpan = document.createElement("span")
        attrSpan.style.fontWeight = "bold"
        attrSpan.textContent = `${child.nodeName}: `

        const valueSpan = document.createElement("span")
        valueSpan.textContent = `${child.textContent}`
        item.appendChild(attrSpan)
        item.appendChild(valueSpan)
        list.appendChild(item)
      }
    }
  })

  detailsContainer.appendChild(list)

  // Update the layout
  treeContainer.classList.toggle("hidden")
  detailsContainer.parentNode.classList.toggle("expanded")
}
