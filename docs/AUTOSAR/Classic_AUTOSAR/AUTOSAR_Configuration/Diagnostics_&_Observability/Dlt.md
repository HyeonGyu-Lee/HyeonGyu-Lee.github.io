---
layout: default
title: "Dlt"
has_children: false
parent: "Diagnostics & Observability"
nav_order: 5
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Diagnostics_&_Observability/Dlt'
last_modified_date: 2026-10-14T16:38:00.000Z
redirect_from:
 - "/3f91b412900a81d2bf03e40e4157a277"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Dlt의 역할
> Diagnostic Log and Trace. Log·trace 정보 전달과 관련 구성을 다룬다. UDS diagnostic service 자체와는 별도 영역이다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Dlt |
| TYPE | ECUC-MODULE-DEF |
| DESC | 미기재 |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| DltGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Flags for adding removing functionality from code. |
| DltMemory | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Configuration parameters for reserving memory for some internal storing and buffer. |
| DltMultipleConfigurationContainer | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the AUTOSAR Dlt module. |
| DltVfbTrace | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | All functions to trace from the VFB by the Dlt. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Dlt" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
