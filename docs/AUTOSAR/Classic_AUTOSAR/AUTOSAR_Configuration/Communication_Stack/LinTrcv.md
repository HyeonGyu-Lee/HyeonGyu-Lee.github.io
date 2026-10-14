---
layout: default
title: "LinTrcv"
has_children: false
parent: "Communication Stack"
nav_order: 36
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack/LinTrcv'
last_modified_date: 2026-10-14T16:40:00.000Z
redirect_from:
 - "/3f91b412900a81e0aff6dce3fd6bb7cc"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## LinTrcv의 역할
> LIN transceiver hardware 제어를 추상화한다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | LinTrcv |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of LIN Transceiver Driver module |
| Multiplicity | [0..*] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| LinTrcvChannel | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | Container gives LIN transceiver driver information about a single LIN transceiver channel. Any LIN transceiver driver has such LIN transceiver channels. |
| LinTrcvGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container gives LIN transceiver driver basic information. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="LinTrcv" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
