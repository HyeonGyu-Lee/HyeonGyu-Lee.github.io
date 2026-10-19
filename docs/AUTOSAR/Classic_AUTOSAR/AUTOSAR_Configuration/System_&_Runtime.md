---
layout: default
title: System & Runtime
has_children: true
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 3
parent: 'AUTOSAR Configuration'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/System_&_Runtime'
redirect_from:
 - "/3f91b412900a81a9a614ed5cfa85cd02"
---
## 실행 주체와 ECU 상태를 모듈별로 나누는 상황


Task·runnable의 실행, ECU lifecycle과 mode arbitration은 서로 다른 모델이다. Module의 상태와 요청·통지 경계를 구분해야 전체 ECU 상태를 일관되게 설명할 수 있다.


## System & Runtime의 구성


> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.


| 모듈   | 역할                                                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------- |
| BswM | BSW mode request와 mode indication을 받아 구성된 rule과 action으로 mode 전환을 조정한다. EcuM이나 개별 communication state manager와 같은 역할은 아니다. |
| EcuC | ECU의 공통 configuration 정보를 담는 구성 영역이다. 실행 module의 단일 기능과 동일하게 해석하지 않는다.                                                     |
| EcuM | ECU State Manager. ECU startup·shutdown·wake-up 등의 lifecycle 관련 상태를 다룬다.                                                   |
| Os   | AUTOSAR Operating System. Task·ISR·event·resource 등 실행과 scheduling 관련 구성의 기반이다.                                            |
| Rte  | Runtime Environment. SWC 간 및 SWC–BSW 간 통신·실행 접점을 구성에 맞게 연결한다.                                                              |
| StbM | Synchronized Time-base Manager. Time base와 시간 상태의 공통 관리를 담당하며 bus-specific time synchronization과 구분한다.                     |
| Tm   | Time Service. 시간 측정과 관련된 공통 service interface를 다룬다.                                                                        |


## 표준 범위


이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.


## 이해를 확인하는 질문


> 같은 그룹의 모듈을 하나의 책임으로 합쳐도 될까?


그룹은 탐색을 위한 분류다. 실제 API·configuration·state의 경계는 개별 module이 정의하므로 각 책임과 연결을 따로 확인한다.

