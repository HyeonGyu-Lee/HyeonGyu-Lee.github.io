# Notion 사이트 컴포넌트

Notion 일반 텍스트 블록에 아래 문자열 하나만 입력하면 importer가 사이트 컴포넌트로 변환합니다. URL이나 코드 블록으로 입력하지 않습니다.

| 문자열 | 표시 |
| --- | --- |
| `site:embed:mcu-peripheral-map` | MCU Peripheral 기능 관계도와 상세 문서 이동 |
| `site:embed:autosar-architecture` | Classic AUTOSAR 계층 관계도와 선택 설명 |

`assets/diagrams/*.mmd`에서 구조를, 같은 이름의 `*-links.json`에서 클릭 대상과 설명을 관리합니다. 문서 대상은 이름 변경에도 유지되는 Notion 페이지 UUID redirect(`/` + 하이픈 없는 UUID)를 사용합니다. JSON의 `description`이 있는 노드는 설명 패널을 열고, 없는 노드는 문서로 이동합니다.

기존 독립 블록 `<div class="canvas-container"><canvas id="autosarCanvas"></canvas></div>`도 AUTOSAR 컴포넌트로 변환됩니다. 코드 예제 안의 문자열은 변환하지 않습니다. 등록되지 않은 `site:embed:*` 토큰은 오타가 게시되지 않도록 import를 중단합니다.

이미지는 importer에서 실제 파일의 width/height를 기록하여 지연 로딩 전에도 공간을 확보합니다. 우측 목차는 고정 목록이며 이미지·글꼴·화면 크기가 바뀌면 현재 항목만 다시 계산합니다.

검증: `npm test`, `bundle exec jekyll build`, `bundle exec ruby _scripts/check-html.rb _site --internal-only`.
