---
layout: default
title: "AUTOSAR Configuration"
has_children: true
published_date: 2024-06-05T03:53:00.000Z
last_modified_date: 2026-10-14T16:01:00.000Z
nav_order: 8
parent: "Classic AUTOSAR"
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration'
redirect_from:
 - "/2efdf43930e745af87fb1b1e97c47015"
 - "/AUTOSAR/Classic_AUTOSAR/Configure_Parameters"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## ECU Configuration의 의미
> ECU Configuration은 단순 옵션 목록이 아니라, BSW module의 구조·parameter·reference와 허용되는 구성 범위를 정의하는 모델이다.
Module Definition은 어떤 설정을 구성할 수 있는지 정의하고, ECU Configuration Values는 특정 ECU에서 선택한 실제 인스턴스와 값을 담는다. Explorer는 실제 차량 설정값이 아니라 표준의 정의를 읽는 도구다.
## AUTOSAR 표준 Explorer
{% include components/standard-explorer.html %}
## Explorer에서 읽는 계층

| 항목 | 의미 |
| --- | --- |
| Module | Dcm, NvM, Can, Lin 등 모듈 정의 |
| Container | 의미상 함께 묶인 설정의 구조 단위. 하위 container를 포함할 수 있음 |
| Parameter | Boolean, integer, enum, string 등 실제 설정 가능한 값의 정의 |
| Reference | 다른 container나 대상 객체에 대한 연결 정의 |
| Choice | 여러 구조 중 선택 관계가 있는 정의. 각 항목을 독립적인 필수 구성으로 세지 않음 |

트리에서는 XML의 CONTAINERS·PARAMETERS 같은 포장 노드를 생략하고 의미 있는 이름을 보여준다. 설명 영역은 type, description, multiplicity와 condition/configuration 관련 원본 metadata를 표시한다.
## Multiplicity: 필수 여부와 개수

| 표시 | 의미 | 읽을 때의 전제 |
| --- | --- | --- |
| [1] | 정확히 1개 | 해당 부모 인스턴스 안에서의 개수 |
| [0..1] | 없거나 1개 | 선택 구성. default가 있다는 사실과 별개 |
| [0..*] | 0개 이상 | 흔히 [*]로 줄여 표현하지만 lower bound를 명확히 표시 |
| [1..*] | 1개 이상 | [1~*]와 같은 취지의 범위 표현. 무제한이 곧 구현 resource 무제한은 아님 |
| [m..n] | m개 이상 n개 이하 | 원본 lower/upper 값 사용 |
| [미기재] | 원본에 범위를 확정할 정보가 없음 | 선택 항목이나 [0..*]로 추정하지 않음 |

LOWER-MULTIPLICITY가 1인 자식이라도 부모가 선택 구성이라면 ECU 전체에서 무조건 존재해야 한다는 뜻은 아니다. 부모를 구성했을 때 자식의 lower bound가 적용된다. Feature 조건·choice·variant·별도 constraint도 함께 확인해야 한다. Multiplicity는 parameter 값의 MIN/MAX가 아니라 설정 인스턴스의 개수다.
## Configuration과 Variant

| 정의 | 해석 |
| --- | --- |
| Default Value | 값 생략 시의 의미를 관련 규격과 함께 읽는 기본값. 필수 개수를 변경하지 않음 |
| Min / Max | 숫자 parameter의 값 범위. 개수 범위와 별개 |
| Supported Config Variants | 지원 구성 variant의 범위 |
| Value Config Classes | 값에 적용되는 구성 시점/분류 |
| Multiplicity Config Classes | 인스턴스 개수의 구성 시점/분류 |
| Post-build 관련 항목 | 값 또는 개수의 post-build 지원 의미를 각각 읽음 |

Pre-compile, link-time, post-build는 값이 결정되는 구성 시점과 관련된 구분이며, 모든 parameter가 모든 방식을 지원하는 것은 아니다.
## 제공 범위와 원본
현재 Explorer는 저장소의 _files/422.arxml을 기준으로 84개 module을 제공한다. 파일의 schema는 AUTOSAR_4-2-2.xsd이며 header에는 Part of Release 4.2, Revision 2, Document Version 4.6.0이 기록돼 있다. Document version과 platform release를 혼동하지 않는다.
Dcm, NvM, Can/CanIf/CanTp/CanSM, Lin/LinIf/LinTp/LinSM, Com, PduR, Dem, EcuM, BswM, OS, Ethernet 및 memory·watchdog·MCAL 관련 module을 선택할 수 있다. Adaptive의 functional cluster 전체를 이 Classic ECUC 파일에서 탐색할 수 있는 것은 아니다.
## IoHwAb의 위치
IoHwAb는 I/O Hardware Abstraction의 책임을 다루는 영역이다. 이 원본의 module 목록에는 IoHwAb가 없으므로 Explorer에 표준 container와 multiplicity를 임의 생성하지 않는다. 해당 release의 IoHwAb 규격·설명과 공급사 정의가 확보되면 출처를 구분해 추가할 수 있다.
