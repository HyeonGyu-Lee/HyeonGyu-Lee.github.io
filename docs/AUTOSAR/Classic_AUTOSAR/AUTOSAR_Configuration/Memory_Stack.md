---
layout: default
title: "Memory Stack"
has_children: true
parent: "AUTOSAR Configuration"
nav_order: 2
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Memory_Stack'
last_modified_date: 2026-10-14T16:38:00.000Z
redirect_from:
 - "/3f91b412900a81048976ed89d32be3e7"
---

## 논리 데이터와 저장 매체를 모듈별로 나누는 상황

Application의 논리 block, memory abstraction과 물리 erase/program은 다른 단위다. Block 상태와 job 상태를 나누어야 비동기 저장과 초기화·복구의 의미가 드러난다.

## Memory Stack의 구성
> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.

| 모듈 | 역할 |
| --- | --- |
| Ea | EEPROM Abstraction. EEPROM 장치에 대한 상위 memory 접근을 추상화하며 논리 NV block 관리의 NvM과 구분한다. |
| Eep | EEPROM hardware 접근 driver. Ea와 NvM의 상위 추상화·block 관리와 구분한다. |
| Fee | Flash EEPROM Emulation. Flash를 이용한 EEPROM 추상화 제공에 필요한 관리 기능을 다룬다. 실제 flash 접근은 Fls와 역할을 나눈다. |
| Fls | Flash driver. Flash memory hardware의 접근 동작을 담당하며 NvM의 논리 block 정책과 구분한다. |
| MemIf | Memory Abstraction Interface. NvM 등 상위 기능과 하위 memory abstraction 사이 공통 interface를 제공한다. |
| MemMap | Memory Mapping. Code·data section을 memory 영역에 배치하기 위한 mapping 규약과 구성이다. NvM처럼 runtime block 저장을 수행하는 module과 구분한다. |
| NvM | Non-volatile RAM Manager. Application의 논리적 비휘발성 data block과 RAM/NV/default data 관계를 관리한다. |

## 표준 범위
이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.

## 이해를 확인하는 질문

> 같은 그룹의 모듈을 하나의 책임으로 합쳐도 될까?

그룹은 탐색을 위한 분류다. 실제 API·configuration·state의 경계는 개별 module이 정의하므로 각 책임과 연결을 따로 확인한다.
