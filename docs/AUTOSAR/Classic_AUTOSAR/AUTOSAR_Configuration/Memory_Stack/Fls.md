---
layout: default
title: Fls
has_children: false
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 4
parent: 'Memory Stack'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Memory_Stack/Fls'
redirect_from:
 - "/3f91b412900a8166a4aef8fc4f0468e0"
---
## Fls의 책임을 논리 데이터와 저장 매체 관점에서 구분하는 상황


Application의 논리 block, memory abstraction과 물리 erase/program은 다른 단위다. Block 상태와 job 상태를 나누어야 비동기 저장과 초기화·복구의 의미가 드러난다. Fls의 최상위 정의에는 FlsConfigSet, FlsGeneral, FlsPublishedInformation 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.


## Fls의 역할


> Flash driver. Flash memory hardware의 접근 동작을 담당하며 NvM의 논리 block 정책과 구분한다.


## 표준 원문


| 항목           | 원문 값                                                                 |
| ------------ | -------------------------------------------------------------------- |
| SHORT-NAME   | Fls                                                                  |
| TYPE         | ECUC-MODULE-DEF                                                      |
| DESC         | Configuration of the Fls (internal or external flash driver) module. |
| Multiplicity | [0..*]                                                               |


## 구성의 첫 계층


| 정의                      | Type                          | 개수  | 설명 원문                                                                                          |
| ----------------------- | ----------------------------- | --- | ---------------------------------------------------------------------------------------------- |
| FlsConfigSet            | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container for runtime configuration parameters of the flash driver.                            |
| FlsGeneral              | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Container for general parameters of the flash driver. These parameters are always pre-compile. |
| FlsPublishedInformation | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Additional published parameters not covered by CommonPublishedInformation container.           |


## 전체 표준 Explorer


{% include components/standard-explorer.html module="Fls" %}


## 개수와 조건의 해석


[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.


## 기준과 범위


원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.


## 이해를 확인하는 질문


> Fls의 container 개수와 parameter 값의 범위는 어떻게 다른가?


Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.

