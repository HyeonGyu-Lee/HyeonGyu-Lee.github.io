---
layout: default
title: "FrTSyn"
has_children: false
parent: "Communication Stack"
nav_order: 22
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack/FrTSyn'
last_modified_date: 2026-10-14T16:40:00.000Z
redirect_from:
 - "/3f91b412900a8128b2d5f02a8b03c19c"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## FrTSyn의 역할
> FlexRay를 통한 time synchronization 관련 기능을 다룬다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | FrTSyn |
| TYPE | ECUC-MODULE-DEF |
| DESC | This represents the specific configuration variant for the TSyn on Flexray. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| FrTSynGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container holds the general parameters of the Flexray-specific Synchronized Time-base Manager |
| FrTSynGlobalTimeDomain | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | This represents the existence of a global time domain on Flexray. The FrTSyn module can administrate several global time domains at the same time that in itself form a hierarchy of domains and sub-domains. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="FrTSyn" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
