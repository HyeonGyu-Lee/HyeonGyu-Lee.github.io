;(function () {
  const make = (tag, text, className) => {
    const element = document.createElement(tag)
    if (text) element.textContent = text
    if (className) element.className = className
    return element
  }
  function cardinality(node) {
    const upper = node.infinite === "true" ? "*" : node.upper
    if (node.lower == null || upper == null) return "[미기재]"
    return node.lower === upper ? `[${upper}]` : `[${node.lower}..${upper}]`
  }
  async function mount(root) {
    if (root.dataset.ready) return
    root.dataset.ready = "true"
    const base = root.dataset.standardBase
    try {
      const response = await fetch(base + "index.json")
      if (!response.ok) throw Error("목록을 읽지 못했습니다.")
      const index = await response.json()
      root.replaceChildren()
      const title = make("h2", "AUTOSAR Configuration Explorer")
      const source = make(
        "p",
        index.release +
          " · ECU Configuration Parameter Definitions · " +
          index.modules.length +
          " modules"
      )
      const label = make("label", "모듈 ")
      const select = make("select")
      select.setAttribute("aria-label", "표준 모듈 선택")
      for (const name of [...index.modules, "IoHwAb"]) {
        const option = make("option", name)
        option.value = name
        select.append(option)
      }
      select.value = index.modules.includes(root.dataset.standardModule)
        ? root.dataset.standardModule
        : "Dcm"
      label.append(select)
      const search = make("input")
      search.type = "search"
      search.placeholder = "이름 또는 설명 검색"
      search.setAttribute("aria-label", "설정 정의 검색")
      const collapse = make("button", "모두 접기")
      collapse.type = "button"
      const tools = make("div", null, "standard-tools")
      tools.append(label, search, collapse)
      const legend = make(
        "p",
        "[1] 1개 · [0..1] 선택 1개 · [0..*] 0개 이상 · [1..*] 1개 이상. 개수는 해당 부모의 각 인스턴스 기준이며 조건·variant·choice 제약을 함께 읽어야 합니다. 미기재는 선택 항목이라는 뜻이 아닙니다.",
        "standard-legend"
      )
      const status = make("p")
      status.setAttribute("role", "status")
      const panes = make("div", null, "standard-panes")
      const tree = make("div", null, "standard-tree")
      tree.setAttribute("aria-label", "설정 계층")
      const detail = make("section", null, "standard-detail")
      detail.setAttribute("aria-label", "선택한 정의 설명")
      panes.append(tree, detail)
      root.append(title, source, tools, legend, status, panes)
      let data,
        request = 0
      function show(node) {
        detail.replaceChildren(
          make("h3", node.name),
          make("p", node.path, "standard-path"),
          make("p", node.type + " " + cardinality(node))
        )
        detail.append(
          make(
            "p",
            node.description ||
              "이 정의의 설명은 원본에 기재되어 있지 않습니다."
          )
        )
        const dl = make("dl")
        for (const [key, value] of Object.entries(node.metadata)) {
          dl.append(make("dt", key), make("dd", value || "미기재"))
        }
        const metadata = make("details", null, "standard-metadata")
        metadata.append(make("summary", "범위·기본값·조건 원문"), dl)
        detail.append(metadata)
        const link = make("a", "원본 ARXML")
        link.href = base + "../../_files/422.arxml"
        detail.append(link)
      }
      function render() {
        if (!data) return
        const query = search.value.trim().toLowerCase()
        let matches = 0
        function branch(node, inherited = false) {
          const match =
            !query ||
            (node.name + " " + (node.description || ""))
              .toLowerCase()
              .includes(query)
          const direct = inherited || match
          const children = node.children
            .map((child) => branch(child, Boolean(query) && direct))
            .filter(Boolean)
          if (!direct && !children.length) return null
          if (match) matches++
          const row = make("div", null, "standard-node")
          const button = make(
            "button",
            node.name + " " + cardinality(node),
            "standard-select"
          )
          button.type = "button"
          button.addEventListener("click", () => {
            tree
              .querySelectorAll('[aria-current="true"]')
              .forEach((x) => x.removeAttribute("aria-current"))
            button.setAttribute("aria-current", "true")
            show(node)
          })
          if (children.length) {
            const details = make("details")
            details.open = Boolean(query)
            const summary = make("summary", node.name + " " + cardinality(node))
            const group = make("div", null, "standard-children")
            summary.addEventListener("click", () => {
              tree
                .querySelectorAll('[aria-current="true"]')
                .forEach((x) => x.removeAttribute("aria-current"))
              summary.setAttribute("aria-current", "true")
              show(node)
            })
            group.append(...children)
            details.append(summary, group)
            row.append(details)
          } else row.append(button)
          return row
        }
        tree.replaceChildren(
          ...data.children.map((node) => branch(node)).filter(Boolean)
        )
        status.textContent = query
          ? `${matches}개 정의 일치 · 상위 경로 함께 표시`
          : "계층을 펼친 뒤 이름 버튼을 선택하면 설명과 원본 조건이 표시됩니다."
      }
      async function load() {
        const current = ++request
        tree.replaceChildren()
        detail.replaceChildren()
        data = null
        search.value = ""
        status.textContent = "불러오는 중…"
        if (select.value === "IoHwAb") {
          status.textContent =
            "IoHwAb는 이 4.2.2 ECUC 원본의 84개 모듈 정의에 포함되지 않습니다."
          detail.append(
            make("h3", "I/O Hardware Abstraction"),
            make(
              "p",
              "상위 기능에 ECU의 I/O 연결과 신호 처리 차이를 추상화하는 영역입니다. 표준 부재를 기능 부재로 해석하지 않습니다. 해당 release의 IoHwAb 설명 및 공급사 정의가 필요하며, 추정한 container나 multiplicity를 표시하지 않습니다."
            )
          )
          return
        }
        try {
          const r = await fetch(base + select.value + ".json")
          if (!r.ok) throw Error("모듈을 읽지 못했습니다.")
          const result = await r.json()
          if (current !== request) return
          data = result
          show(data)
          render()
        } catch (error) {
          if (current === request) status.textContent = error.message
        }
      }
      select.addEventListener("change", load)
      search.addEventListener("input", render)
      collapse.addEventListener("click", () => {
        tree.querySelectorAll("details").forEach((x) => {
          x.open = false
        })
      })
      await load()
    } catch (error) {
      root.textContent = "Explorer를 불러오지 못했습니다. " + error.message
    }
  }
  function start() {
    document.querySelectorAll(".standard-explorer").forEach(mount)
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start)
  else start()
})()
