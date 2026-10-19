---
layout: default
title: "Os"
has_children: false
parent: "System & Runtime"
nav_order: 4
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/System_&_Runtime/Os'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a81b193b2d71c117a833c"
---

## Os의 책임을 실행 주체와 ECU 상태 관점에서 구분하는 상황

Task·runnable의 실행, ECU lifecycle과 mode arbitration은 서로 다른 모델이다. Module의 상태와 요청·통지 경계를 구분해야 전체 ECU 상태를 일관되게 설명할 수 있다. Os의 최상위 정의에는 OsAlarm, OsAppMode, OsApplication 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.

## Os의 역할
> AUTOSAR Operating System. Task·ISR·event·resource 등 실행과 scheduling 관련 구성의 기반이다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | Os |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the Os (Operating System) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| OsAlarm | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | An OsAlarm may be used to asynchronously inform or activate a specific task. It is possible to start alarms automatically at system start-up depending on the application mode. |
| OsAppMode | ECUC-PARAM-CONF-CONTAINER-DEF | [1..*] | OsAppMode is the object used to define OSEK OS properties for an OSEK OS application mode. |
| OsApplication | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | An AUTOSAR OS must be capable of supporting a collection of OS objects (tasks, interrupts, alarms, hooks etc.) that form a cohesive functional unit. This collection of objects is termed an OS-Application. |
| OsCounter | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Configuration information for the counters that belong to the OsApplication. |
| OsEvent | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Representation of OS events in the configuration context. Adopted from the OSEK OIL specification. |
| OsIoc | ECUC-PARAM-CONF-CONTAINER-DEF | [0..1] | Configuration of the IOC (Inter OS Application Communicator). |
| OsIsr | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | The OsIsr container represents an OSEK interrupt service routine. |
| OsOS | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | OS is the object used to define OSEK OS properties for an OSEK application. |
| OsResource | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | An OsResource object is used to co-ordinate the concurrent access by tasks and ISRs to a shared resource, e.g. the scheduler, any program sequence, memory or any hardware area. |
| OsScheduleTable | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | An OsScheduleTable addresses the synchronization issue by providing an encapsulation of a statically defined set of alarms that cannot be modified at runtime. |
| OsSpinlock | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | An OsSpinlock object is used to co-ordinate concurrent access by TASKs/ISR2s on different cores to a shared resource. |
| OsTask | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | This container represents an OSEK task. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="Os" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.

## 이해를 확인하는 질문

> Os의 container 개수와 parameter 값의 범위는 어떻게 다른가?

Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.
