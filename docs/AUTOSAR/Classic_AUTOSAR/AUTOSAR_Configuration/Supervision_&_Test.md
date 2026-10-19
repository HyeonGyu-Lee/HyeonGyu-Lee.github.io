---
layout: default
title: Supervision & Test
has_children: true
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 6
parent: 'AUTOSAR Configuration'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test'
redirect_from:
 - "/3f91b412900a81cab352c7b5b661f6aa"
---
## 오류 탐지와 감독를 모듈별로 나누는 상황


데이터 오류 검사, 메모리·CPU 시험과 software 진행 감시는 관찰 대상이 다르다. 오류를 찾는 기능과 reset·degradation 같은 반응 정책은 별도로 연결된다.


## Supervision & Test의 구성


> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.


| 모듈     | 역할                                                                                                                   |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| CorTst | CPU core 관련 self-test 기능의 interface와 구성을 다룬다. 전체 application의 기능 정상 판정과 동일하지 않다.                                     |
| Crc    | CRC 계산 기능을 제공한다. CRC에 의한 우발 손상 검출을 암호학적 인증과 동일시하지 않는다.                                                               |
| FlsTst | Flash memory test 기능과 그 구성을 다룬다. Fls의 일반 memory 접근과 역할이 다르다.                                                         |
| RamTst | RAM memory test 기능을 다룬다. 일반 memory allocation이나 NvM 저장 기능과 구분한다.                                                     |
| Wdg    | Watchdog hardware driver. Watchdog device의 hardware 접근을 제공한다.                                                        |
| WdgIf  | Watchdog Interface. 상위 watchdog 관리와 실제 watchdog driver 사이를 추상화한다.                                                    |
| WdgM   | Watchdog Manager. Supervised entity와 supervision 관련 상태를 관리하고 watchdog interface와 연결한다. Wdg hardware driver 자체와 구분한다. |


## 표준 범위


이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.


## 이해를 확인하는 질문


> 같은 그룹의 모듈을 하나의 책임으로 합쳐도 될까?


그룹은 탐색을 위한 분류다. 실제 API·configuration·state의 경계는 개별 module이 정의하므로 각 책임과 연결을 따로 확인한다.

