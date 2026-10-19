---
layout: default
title: "FlsTst"
has_children: false
parent: "Supervision & Test"
nav_order: 3
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test/FlsTst'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a81738472e938de05fb17"
---

## FlsTst의 책임을 오류 탐지와 감독 관점에서 구분하는 상황

데이터 오류 검사, 메모리·CPU 시험과 software 진행 감시는 관찰 대상이 다르다. 오류를 찾는 기능과 reset·degradation 같은 반응 정책은 별도로 연결된다. FlsTst의 최상위 정의에는 FlsTstConfigSet, FlsTstConfigurationOfOptApiServices, FlsTstDemEventParameterRefs 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.

## FlsTst의 역할
> Flash memory test 기능과 그 구성을 다룬다. Fls의 일반 memory 접근과 역할이 다르다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | FlsTst |
| TYPE | ECUC-MODULE-DEF |
| DESC | 미기재 |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| FlsTstConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the AUTOSAR FlsTst module. |
| FlsTstConfigurationOfOptApiServices | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | 미기재 |
| FlsTstDemEventParameterRefs | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for the references to DemEventParameter elements which shall be invoked using the API Dem_ReportErrorStatus API in case the corresponding error occurs. The EventId is taken from the referenced DemEventParameter's DemEventId value. The standardized errors are provided in the container and can be extended by vendor specific error references. |
| FlsTstGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | 미기재 |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="FlsTst" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.

## 이해를 확인하는 질문

> FlsTst의 container 개수와 parameter 값의 범위는 어떻게 다른가?

Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.
