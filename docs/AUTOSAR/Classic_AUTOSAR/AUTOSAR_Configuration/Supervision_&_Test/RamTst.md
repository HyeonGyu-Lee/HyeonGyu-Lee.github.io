---
layout: default
title: "RamTst"
has_children: false
parent: "Supervision & Test"
nav_order: 4
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test/RamTst'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a810791edc6ad1b651030"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## RamTst의 역할
> RAM memory test 기능을 다룬다. 일반 memory allocation이나 NvM 저장 기능과 구분한다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | RamTst |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the RamTst module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| RamTstCommon | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container holds a list of all available functions in the RamTst module. Each function is turned ON or OFF before compiling so that only the desired functions and test algorithms are in the compiled code. |
| RamTstDemEventParameterRefs | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for the references to DemEventParameter elements which shall be invoked using the API Dem_ReportErrorStatus in case the corresponding error occurs. The EventId is taken from the referenced DemEventParameter's DemEventId value. |
| RamTstPublishedInformation | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container holding all RamTst specific published information parameter. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="RamTst" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
