---
layout: default
title: Wdg
has_children: false
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 5
parent: 'Supervision & Test'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Supervision_&_Test/Wdg'
redirect_from:
 - "/3f91b412900a814e845fcfd4f2278f49"
---
## Wdg의 책임을 오류 탐지와 감독 관점에서 구분하는 상황


데이터 오류 검사, 메모리·CPU 시험과 software 진행 감시는 관찰 대상이 다르다. 오류를 찾는 기능과 reset·degradation 같은 반응 정책은 별도로 연결된다. Wdg의 최상위 정의에는 WdgDemEventParameterRefs, WdgGeneral, WdgPublishedInformation 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.


## Wdg의 역할


> Watchdog hardware driver. Watchdog device의 hardware 접근을 제공한다.


## 표준 원문


| 항목           | 원문 값                                               |
| ------------ | -------------------------------------------------- |
| SHORT-NAME   | Wdg                                                |
| TYPE         | ECUC-MODULE-DEF                                    |
| DESC         | Configuration of the Wdg (Watchdog driver) module. |
| Multiplicity | [0..*]                                             |


## 구성의 첫 계층


| 정의                       | Type                          | 개수     | 설명 원문                                                                                                                                                                                                                                        |
| ------------------------ | ----------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WdgDemEventParameterRefs | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Container for the references to DemEventParameter elements which shall be invoked using the API Dem_ReportErrorStatus in case the corresponding error occurs. The EventId is taken from the referenced DemEventParameter's DemEventId value. |
| WdgGeneral               | ECUC-PARAM-CONF-CONTAINER-DEF | [1]    | All general parameters of the watchdog driver are collected here.                                                                                                                                                                            |
| WdgPublishedInformation  | ECUC-PARAM-CONF-CONTAINER-DEF | [1]    | Container holding all Wdg specific published information parameters                                                                                                                                                                          |
| WdgSettingsConfig        | ECUC-PARAM-CONF-CONTAINER-DEF | [1]    | Configuration items for the different watchdog settings, including those for external watchdog hardware.                                                                                                                                     |


## 전체 표준 Explorer


{% include components/standard-explorer.html module="Wdg" %}


## 개수와 조건의 해석


[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.


## 기준과 범위


원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.


## 이해를 확인하는 질문


> Wdg의 container 개수와 parameter 값의 범위는 어떻게 다른가?


Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.

