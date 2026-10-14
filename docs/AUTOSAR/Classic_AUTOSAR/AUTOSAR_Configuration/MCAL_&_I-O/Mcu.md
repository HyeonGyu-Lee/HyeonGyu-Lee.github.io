---
layout: default
title: "Mcu"
has_children: false
parent: "MCAL & I-O"
nav_order: 6
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/MCAL_&_I-O/Mcu'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a8191a999d9b6b07a0be2"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Mcu의 역할
> MCU의 clock·reset·power mode 등 공통 hardware 기능에 대한 MCAL driver다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Mcu |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Mcu (Microcontroller Unit) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| McuGeneralConfiguration | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration (parameters) of the MCU driver. |
| McuModuleConfiguration | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration (parameters) of the MCU driver |
| McuPublishedInformation | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container holding all MCU specific published information parameters |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Mcu" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
