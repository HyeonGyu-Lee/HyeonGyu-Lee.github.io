---
layout: default
title: "Dem"
has_children: false
parent: "Diagnostics & Observability"
nav_order: 3
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Diagnostics_&_Observability/Dem'
last_modified_date: 2026-10-14T16:38:00.000Z
redirect_from:
 - "/3f91b412900a81eea8baf0170dab65f6"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Dem의 역할
> Diagnostic Event Manager. Event 상태와 DTC 관련 정보를 관리한다. Event reporting, debounce, event memory와 DTC 표현은 서로 연결되지만 같은 개념은 아니다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Dem |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Dem (Diagnostic Event Manager) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| DemConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the Dem module supporting multiple configuration sets. |
| DemGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration (parameters) of the BSW Dem |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Dem" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
