---
layout: default
title: "Can"
has_children: false
parent: "Communication Stack"
nav_order: 1
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack/Can'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a81f280fccc13bda6dfa7"
 - "/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Can"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## CAN Driver와 CAN Stack
> Can은 MCU의 CAN controller를 다루는 MCAL driver다. 차량의 CAN network 전체나 CAN 관련 AUTOSAR module 전체를 뜻하지 않는다.

## 책임과 주변 모듈

| 영역 | 의미 |
| --- | --- |
| Can | Controller·hardware object 등 hardware에 가까운 driver 책임 |
| CanIf | 상위 통신과 CAN driver 사이 interface 및 PDU/hardware 연결 추상화 |
| CanTp | 진단 등 큰 payload의 transport segmentation/reassembly |
| CanSM / CanNm | 통신 mode 조정과 network management를 서로 다른 책임으로 구분 |
| Com / PduR | Signal/I-PDU 처리와 PDU routing. Can driver가 직접 모두 담당하지 않음 |

## 표준 Configuration Explorer
{% include components/standard-explorer.html module="Can" %}

현재 표시하는 기준은 Classic AUTOSAR 4.2.2 ECUC 원본이다. 다른 release의 항목이나 공급사 확장을 같은 정의로 취급하지 않는다. 이름을 선택하면 description과 원본 metadata를 확인할 수 있다.

## 표준 구조를 읽는 관점
Container는 의미 단위, parameter는 그 안의 값 정의, reference는 다른 구성과의 관계다. 데이터 type과 값 범위, 개수 범위, variant 조건을 구분한다. Module이 정의돼 있다는 사실만으로 특정 ECU에 그 module이 필수라는 뜻은 아니다.
## Multiplicity와 조건
[1]은 해당 부모 아래 정확히 하나, [0..1]은 선택적으로 하나, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모가 선택 구성이라면 그 자식의 [1]을 ECU 전체의 필수로 확대 해석하지 않는다. 조건·choice와 configuration class는 원본 metadata에서 함께 확인한다.
