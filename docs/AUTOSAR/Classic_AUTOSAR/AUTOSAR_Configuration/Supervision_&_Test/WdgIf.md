---
layout: default
title: "WdgIf"
has_children: false
parent: "Supervision & Test"
nav_order: 6
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test/WdgIf'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a81f9bac1dae7de30b5c3"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## WdgIf의 역할
> Watchdog Interface. 상위 watchdog 관리와 실제 watchdog driver 사이를 추상화한다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | WdgIf |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the WdgIf (Watchdog Interface) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| WdgIfDevice | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | It contains the information for the selection of a particular Watchdog device in case multiple Watchdog drivers are connected. |
| WdgIfGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container collects all generic watchdog interface parameters. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="WdgIf" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
