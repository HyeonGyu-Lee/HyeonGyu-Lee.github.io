---
layout: default
title: "FlsTst"
has_children: false
parent: "Supervision & Test"
nav_order: 3
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test/FlsTst'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a81738472e938de05fb17"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## FlsTst의 역할
> Flash memory test 기능과 그 구성을 다룬다. Fls의 일반 memory 접근과 역할이 다르다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | FlsTst |
| TYPE | ECUC-MODULE-DEF |
| DESC | 미기재 |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| FlsTstConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the AUTOSAR FlsTst module. |
| FlsTstConfigurationOfOptApiServices | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | 미기재 |
| FlsTstDemEventParameterRefs | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for the references to DemEventParameter elements which shall be invoked using the API Dem_ReportErrorStatus API in case the corresponding error occurs. The EventId is taken from the referenced DemEventParameter's DemEventId value. The standardized errors are provided in the container and can be extended by vendor specific error references. |
| FlsTstGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | 미기재 |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="FlsTst" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
