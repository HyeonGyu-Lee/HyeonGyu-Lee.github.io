---
layout: default
title: "EcuC"
has_children: false
parent: "System & Runtime"
nav_order: 2
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/System_&_Runtime/EcuC'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a81f7accbcc827ede344b"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## EcuC의 역할
> ECU의 공통 configuration 정보를 담는 구성 영역이다. 실행 module의 단일 기능과 동일하게 해석하지 않는다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | EcuC |
| TYPE | ECUC-MODULE-DEF |
| DESC | Virtual module to collect ECU Configuration specific / global configuration information. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| EcucConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | This container contains the configuration parameters and sub containers of the global PduCollection. |
| EcucHardware | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Hardware definition of this Ecu. |
| EcucPartitionCollection | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Collection of Partitions defined for this ECU. |
| EcucPostBuildVariants | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Collection of toplevel PostBuildSelectable variants. The PredefinedVariants linked inside this container will determine how many PostBuildSelectableVariants exist. If this container exist the name pattern for initialization of BSW modules will be &lt;Mip&gt;_Config_&lt;PredefinedVariant.shortName&gt;. If this container does not exist the name pattern for initialization of BSW modlues will be &lt;Mip&gt;_Config. |
| EcucUnitGroupAssignment | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Collection of UnitGroup references to support the generation of ASAM MCD file. |
| EcucVariationResolver | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Collection of PredefinedVariant elements containing definition of values for SwSystemconst which shall be applied when resolving the variability during ECU Configuration. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="EcuC" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
