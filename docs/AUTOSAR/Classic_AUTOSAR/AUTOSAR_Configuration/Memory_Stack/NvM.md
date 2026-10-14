---
layout: default
title: "NvM"
has_children: false
parent: "Memory Stack"
nav_order: 7
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Memory_Stack/NvM'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a810fbffbc2c14924d21d"
 - "/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/NvM"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Non-volatile RAM Manager
> Application이 사용하는 논리적 비휘발성 data block을 관리하며, 하위 저장 장치와의 결합을 줄이는 memory service다.

## 책임과 주변 모듈

| 영역 | 의미 |
| --- | --- |
| 논리 block | Application data와 block의 속성·관리 단위 |
| RAM/NV/ROM data | 실행 중 사용하는 RAM, 비휘발 저장본, 기본 data의 역할을 구분 |
| Block 관리 | Native·redundant·dataset 등 block management 의미는 해당 정의와 조건을 따름 |
| 하위 관계 | MemIf를 통해 Fee/Ea 등 하위 추상화와 연결되며 Fls/Eep driver 자체와 동일하지 않음 |

## 표준 Configuration Explorer
{% include components/standard-explorer.html module="NvM" %}

현재 표시하는 기준은 Classic AUTOSAR 4.2.2 ECUC 원본이다. 다른 release의 항목이나 공급사 확장을 같은 정의로 취급하지 않는다. 이름을 선택하면 description과 원본 metadata를 확인할 수 있다.

## 표준 구조를 읽는 관점
Container는 의미 단위, parameter는 그 안의 값 정의, reference는 다른 구성과의 관계다. 데이터 type과 값 범위, 개수 범위, variant 조건을 구분한다. Module이 정의돼 있다는 사실만으로 특정 ECU에 그 module이 필수라는 뜻은 아니다.
## Multiplicity와 조건
[1]은 해당 부모 아래 정확히 하나, [0..1]은 선택적으로 하나, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모가 선택 구성이라면 그 자식의 [1]을 ECU 전체의 필수로 확대 해석하지 않는다. 조건·choice와 configuration class는 원본 metadata에서 함께 확인한다.
