---
layout: default
title: "Adc"
has_children: false
parent: "MCAL & I-O"
nav_order: 1
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/MCAL_&_I-O/Adc'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a8116b2bcfcc9b7f9ac68"
---

## Adc의 책임을 응용 기능과 hardware 자원 관점에서 구분하는 상황

Peripheral driver는 MCU 자원을 설정·제어하고 상위 software는 신호와 기능의 의미를 다룬다. Channel, pin과 clock의 hardware 제약은 ECU별 configuration에 반영된다. Adc의 최상위 정의에는 AdcConfigSet, AdcGeneral, AdcPublishedInformation 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.

## Adc의 역할
> Analog 입력을 digital 값으로 변환하는 ADC peripheral driver. Channel과 group 같은 hardware 가까운 구성을 다룬다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Adc |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Adc (Analog Digital Conversion) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| AdcConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the AUTOSAR Adc module. |
| AdcGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | General configuration (parameters) of the ADC Driver software module. |
| AdcPublishedInformation | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Additional published parameters not covered by "Common" Published Information. Note that these parameters have "PUBLISHED-INFORMATION" configuration class setting, since they are published information. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Adc" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.

## 이해를 확인하는 질문

> Adc의 container 개수와 parameter 값의 범위는 어떻게 다른가?

Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.
