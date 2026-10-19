---
layout: default
title: "Rte"
has_children: false
parent: "System & Runtime"
nav_order: 5
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/System_&_Runtime/Rte'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a818180fac4eb09f4b92c"
---

## Rte의 책임을 실행 주체와 ECU 상태 관점에서 구분하는 상황

Task·runnable의 실행, ECU lifecycle과 mode arbitration은 서로 다른 모델이다. Module의 상태와 요청·통지 경계를 구분해야 전체 ECU 상태를 일관되게 설명할 수 있다. Rte의 최상위 정의에는 RteBswGeneral, RteBswModuleInstance, RteGeneration 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.

## Rte의 역할
> Runtime Environment. SWC 간 및 SWC–BSW 간 통신·실행 접점을 구성에 맞게 연결한다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Rte |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Rte (Runtime Environment) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| RteBswGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | General configuration parameters of the Bsw Scheduler section. |
| RteBswModuleInstance | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Represents one instance of a Bsw-Module configured on one ECU. |
| RteGeneration | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | This container holds the parameters for the configuration of the RTE Generation. |
| RteImplicitCommunication | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Configuration of the Implicit Communication behavior to be generated. |
| RteInitializationBehavior | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | Specifies the initialization strategy for variables allocated by RTE with the purpose to implement VariableDataPrototypes. |
| RteInitializationRunnableBatch | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | This container corresponds to an Rte_Init_&lt;shortName of this container&gt; function invoking the mapped RunnableEntities. |
| RteOsInteraction | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | Interaction of the Rte with the Os. |
| RtePostBuildVariantConfiguration | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Specifies the PostbuildVariantSets for each of the PostBuild configurations of the RTE. |
| RteSwComponentInstance | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Representation of one SwComponentPrototype located on the to be configured ECU. All subcontainer configuration aspects are in relation to this SwComponentPrototype. |
| RteSwComponentType | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Representation of one SwComponentType for the base of all configuration parameter which are affecting the whole type and not a specific instance. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Rte" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.

## 이해를 확인하는 질문

> Rte의 container 개수와 parameter 값의 범위는 어떻게 다른가?

Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.
