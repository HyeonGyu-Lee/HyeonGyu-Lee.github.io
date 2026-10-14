---
layout: default
title: "Eth"
has_children: false
parent: "Communication Stack"
nav_order: 11
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack/Eth'
last_modified_date: 2026-10-14T16:40:00.000Z
redirect_from:
 - "/3f91b412900a81d3aeafcc416a54bffd"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Eth의 역할
> Ethernet controller driver. MAC/controller hardware 접근을 다루며 TCP/IP나 socket service와는 다른 계층이다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Eth |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Eth (Ethernet Driver) module. |
| Multiplicity | [0..*] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| EthConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the AUTOSAR Eth module. |
| EthGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | General configuration of Ethernet Driver module |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Eth" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
