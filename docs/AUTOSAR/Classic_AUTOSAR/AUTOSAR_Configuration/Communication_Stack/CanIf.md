---
layout: default
title: "CanIf"
has_children: false
parent: "Communication Stack"
nav_order: 2
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack/CanIf'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a8151b8f2c776f6e2537e"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## CanIf의 역할
> 상위 통신 module과 CAN driver 사이 interface. Controller와 PDU 관계를 추상화한다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | CanIf |
| TYPE | ECUC-MODULE-DEF |
| DESC | This container includes all necessary configuration sub-containers according the CAN Interface configuration structure. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| CanIfCtrlDrvCfg | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | Configuration parameters for all the underlying CAN Driver modules are aggregated under this container. For each CAN Driver module a seperate instance of this container has to be provided. |
| CanIfDispatchCfg | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Callback functions provided by upper layer modules of the CanIf. The callback functions defined in this container are common to all configured CAN Driver / CAN Transceiver Driver modules. |
| CanIfInitCfg | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the init parameters of the CAN Interface. |
| CanIfPrivateCfg | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the private configuration (parameters) of the CAN Interface. |
| CanIfPublicCfg | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the public configuration (parameters) of the CAN Interface. |
| CanIfTrcvDrvCfg | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | This container contains the configuration (parameters) of all addressed CAN transceivers by each underlying CAN Transceiver Driver module. For each CAN transceiver Driver a seperate instance of this container shall be provided. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="CanIf" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.
