---
layout: default
title: "BswM"
has_children: false
parent: "System & Runtime"
nav_order: 1
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/System_&_Runtime/BswM'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a810a8454fb41f9b4b6a0"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## BswM의 역할
> BSW mode request와 mode indication을 받아 구성된 rule과 action으로 mode 전환을 조정한다. EcuM이나 개별 communication state manager와 같은 역할은 아니다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | BswM |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the BswM (Basic SW Mode Manager) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| BswMConfig | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | This container contains the configuration parameters and sub containers of the AUTOSAR BswM module. This container exists once per partition. |
| BswMGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | General configuration parameters of the Basic SW Mode Manager. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="BswM" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
