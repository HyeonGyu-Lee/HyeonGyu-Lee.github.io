---
layout: default
title: Diagnostics & Observability
has_children: true
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 1
parent: 'AUTOSAR Configuration'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Diagnostics_&_Observability'
redirect_from:
 - "/3f91b412900a81fbab5fd57316609a81"
---
## 고장 정보와 진단 접근를 모듈별로 나누는 상황


Fault 관찰, event 상태 저장, diagnostic service 처리와 기능 허용 판단은 서로 다른 책임이다. 이 경계를 나누면 같은 오류가 어떤 상태와 응답으로 표현되는지 설명할 수 있다.


## Diagnostics & Observability의 구성


> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.


| 모듈  | 역할                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------- |
| Dbg | Debugging 관련 구성과 관찰 지원을 다룬다. Dcm의 외부 진단 service와 구분한다.                                                                     |
| Dcm | Diagnostic Communication Manager. DSL·DSD·DSP 책임을 통해 진단 연결·service dispatch·service 처리를 구성한다.                              |
| Dem | Diagnostic Event Manager. Event 상태와 DTC 관련 정보를 관리한다. Event reporting, debounce, event memory와 DTC 표현은 서로 연결되지만 같은 개념은 아니다. |
| Det | Development Error Tracer. 개발 오류 보고를 위한 경량 interface이며 차량 DTC lifecycle을 관리하는 Dem과 구분한다.                                    |
| Dlt | Diagnostic Log and Trace. Log·trace 정보 전달과 관련 구성을 다룬다. UDS diagnostic service 자체와는 별도 영역이다.                                |
| FiM | Function Inhibition Manager. Diagnostic event 상태 등 구성된 조건을 기능 실행 허용 여부와 연결한다. DTC 저장 자체를 담당하지 않는다.                         |
| Xcp | Measurement·calibration 등에 사용되는 XCP protocol 관련 구성이다. UDS 진단 service와 동일하지 않다.                                             |


## 표준 범위


이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.


## 이해를 확인하는 질문


> 같은 그룹의 모듈을 하나의 책임으로 합쳐도 될까?


그룹은 탐색을 위한 분류다. 실제 API·configuration·state의 경계는 개별 module이 정의하므로 각 책임과 연결을 따로 확인한다.

