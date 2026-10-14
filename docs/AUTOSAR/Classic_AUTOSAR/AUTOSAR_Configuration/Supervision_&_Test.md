---
layout: default
title: "Supervision & Test"
has_children: true
parent: "AUTOSAR Configuration"
nav_order: 6
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test'
last_modified_date: 2026-10-14T16:38:00.000Z
redirect_from:
 - "/3f91b412900a81cab352c7b5b661f6aa"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Supervision & Test의 구성
> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.

| 모듈 | 역할 |
| --- | --- |
| CorTst | CPU core 관련 self-test 기능의 interface와 구성을 다룬다. 전체 application의 기능 정상 판정과 동일하지 않다. |
| Crc | CRC 계산 기능을 제공한다. CRC에 의한 우발 손상 검출을 암호학적 인증과 동일시하지 않는다. |
| FlsTst | Flash memory test 기능과 그 구성을 다룬다. Fls의 일반 memory 접근과 역할이 다르다. |
| RamTst | RAM memory test 기능을 다룬다. 일반 memory allocation이나 NvM 저장 기능과 구분한다. |
| Wdg | Watchdog hardware driver. Watchdog device의 hardware 접근을 제공한다. |
| WdgIf | Watchdog Interface. 상위 watchdog 관리와 실제 watchdog driver 사이를 추상화한다. |
| WdgM | Watchdog Manager. Supervised entity와 supervision 관련 상태를 관리하고 watchdog interface와 연결한다. Wdg hardware driver 자체와 구분한다. |

## 표준 범위
이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.
