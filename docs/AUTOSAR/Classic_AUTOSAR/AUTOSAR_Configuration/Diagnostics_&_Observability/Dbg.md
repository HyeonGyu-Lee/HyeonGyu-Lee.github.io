---
layout: default
title: "Dbg"
has_children: false
parent: "Diagnostics & Observability"
nav_order: 1
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Diagnostics_&_Observability/Dbg'
last_modified_date: 2026-10-14T16:38:00.000Z
redirect_from:
 - "/3f91b412900a81b79df3fd32e52e4b49"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Dbg의 역할
> Debugging 관련 구성과 관찰 지원을 다룬다. Dcm의 외부 진단 service와 구분한다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Dbg |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the debugging module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| DbgBuffering | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | This container holds the parameters to manage the storage of debugging data in RAM. |
| DbgCommunication | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | This container holds all configuration parameters for communication. |
| DbgDIDConfiguration | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container holding the sub-structure for DID configuration. |
| DbgGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container holds the general parameters of the debugging module. |
| DbgPeriodicDataCollection | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | This container holds the parameters to manage the time base of the debugging module. |
| DbgTimestampConfiguration | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | This container holds the parameters to manage the time stamps of the debugging module. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Dbg" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
