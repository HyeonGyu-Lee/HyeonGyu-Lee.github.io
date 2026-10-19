# Technical article style

Use a concrete question to connect concepts, mechanisms and evidence. State the role of adjacent layers; distinguish an API accepting work from the operation completing. Use tables for real comparisons, diagrams for relationships, and prose for the reasons behind each decision.

Keep English technical names where translation obscures common usage. Preserve C examples, error paths and platform constraints. AUTOSAR standard and release pages focus on responsibilities and configuration relationships rather than adding implementation exercises. Exact release-specific statements need the matching source; do not invent citations or measurements.

End with a subject-specific comprehension question and an explanatory answer. Avoid editorial notes about what the author plans to write, repeated generic warnings and unsupported claims of improvement. Existing source tables, diagrams and Explorer embeds remain part of the article.

The common layout supplies chapter numbers, a collapsible outline, responsive tables and print typography. Notion remains the source of article content; do not put shared presentation markup into its text. The importer must not add a second Table of contents block.

## Technical terminology

- 같은 개념에는 문서와 diagram 전체에서 같은 용어를 사용한다. 한국어와 영어 동의어를 임의로 교차 사용하지 않는다.
- Application은 데이터를 생성·처리하는 프로그램 또는 기능을 뜻한다. OS, driver, middleware와 구분하고, 단독 표현인 “응용”은 사용하지 않는다.
- Automotive Ethernet의 배선은 `single twisted pair`로 통일한다. Short-reach, point-to-point, multidrop, half-duplex, full-duplex는 배선 명칭이 아니라 별도 특성이므로 구분해 설명한다.
- DMA descriptor는 buffer 주소·길이·상태 등의 제어 정보다. Payload가 descriptor로 변환된다고 표현하지 않는다.
- Sensor와 actuator는 장치이며, 측정·출력 제어는 application 기능이다. ADC, GPIO, timer 등 MCU peripheral과 구분한다.

### 표기 일관성

설명 문장은 한국어로 쓰되 아래 기술 용어는 영어 표기를 유지한다. 같은 뜻의 한글 음역을 괄호에 반복하지 않는다. 약어의 정식 명칭과 실제 의미를 설명하는 괄호는 유지한다.

| 개념 | 표준 표기 |
| --- | --- |
| 프로그램 계층 | application, middleware, OS, driver |
| 통신 구조 | protocol, interface, network, node, gateway, topology |
| 전송 데이터 | message, frame, packet, buffer |
| MCU 구성 | controller, transceiver, register, clock, interrupt |
| 실행 단위 | process, thread, callback, timeout |
| 배선 및 duplex | single twisted pair, full-duplex, half-duplex |
| 자료 및 구성 요소 | datasheet, sensor, hardware, software |

`양방향`만으로 full-duplex를 설명하지 않는다. 동시 송수신 여부를 명시한다. 데이터 serialization과 공유 자원의 순차 접근은 서로 다른 개념이므로, 후자는 한 번에 접근 가능한 task 수와 보호 수단으로 설명한다. 코드 식별자, URL, 표준의 공식 명칭은 표기 통일을 이유로 변경하지 않는다.
