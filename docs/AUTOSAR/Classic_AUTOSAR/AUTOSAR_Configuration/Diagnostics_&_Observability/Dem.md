---
layout: default
title: Dem
has_children: false
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 3
parent: 'Diagnostics & Observability'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Diagnostics_&_Observability/Dem'
redirect_from:
 - "/3f91b412900a81eea8baf0170dab65f6"
---
## Dem의 책임을 고장 정보와 진단 접근 관점에서 구분하는 상황


Fault 관찰, event 상태 저장, diagnostic service 처리와 기능 허용 판단은 서로 다른 책임이다. 이 경계를 나누면 같은 오류가 어떤 상태와 응답으로 표현되는지 설명할 수 있다. Dem의 최상위 정의에는 DemConfigSet, DemGeneral 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.


## Dem의 역할


> Diagnostic Event Manager. Event 상태와 DTC 관련 정보를 관리한다. Event reporting, debounce, event memory와 DTC 표현은 서로 연결되지만 같은 개념은 아니다.


## 표준 원문


| 항목           | 원문 값                                                        |
| ------------ | ----------------------------------------------------------- |
| SHORT-NAME   | Dem                                                         |
| TYPE         | ECUC-MODULE-DEF                                             |
| DESC         | Configuration of the Dem (Diagnostic Event Manager) module. |
| Multiplicity | [0..1]                                                      |


## 구성의 첫 계층


| 정의           | Type                          | 개수  | 설명 원문                                                                                                                             |
| ------------ | ----------------------------- | --- | --------------------------------------------------------------------------------------------------------------------------------- |
| DemConfigSet | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration parameters and sub containers of the Dem module supporting multiple configuration sets. |
| DemGeneral   | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container contains the configuration (parameters) of the BSW Dem                                                             |


## 전체 표준 Explorer


{% include components/standard-explorer.html module="Dem" %}


## 개수와 조건의 해석


[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.


## 기준과 범위


원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.


## 이해를 확인하는 질문


> Dem의 container 개수와 parameter 값의 범위는 어떻게 다른가?


Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.

