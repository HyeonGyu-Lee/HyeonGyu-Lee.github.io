---
layout: default
title: "SecOC"
has_children: false
parent: "Security Services"
nav_order: 3
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Security_Services/SecOC'
last_modified_date: 2026-10-14T16:39:00.000Z
redirect_from:
 - "/3f91b412900a819a89e4c516e61e2cea"
---

## SecOC의 책임을 암호 연산과 보호 정책 관점에서 구분하는 상황

암호 primitive, key 사용 정책과 PDU 보호는 서로 다른 책임이다. Module의 interface는 그 책임을 연결하며 hardware 저장·연산 방식과 application의 보호 목적을 구분한다. SecOC의 최상위 정의에는 SecOCGeneral, SecOCRxPduProcessing, SecOCSameBufferPduCollection 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.

## SecOC의 역할
> Secure Onboard Communication. Authenticity·integrity·freshness 관련 보호를 PDU 통신에 연결한다. 일반적인 payload encryption과 동일하지 않다.

## 표준 원문

| 항목 | 원문 값 |
| --- | --- |
| SHORT-NAME | SecOC |
| TYPE | ECUC-MODULE-DEF |
| DESC | Configuration of the SecOC (SecureOnboardCommunication) module. |
| Multiplicity | [0..1] |

## 구성의 첫 계층

| 정의 | Type | 개수 | 설명 원문 |
| --- | --- | --- | --- |
| SecOCGeneral | ECUC-PARAM-CONF-CONTAINER-DEF | [1] | Contains the general configuration parameters of the SecOC module. |
| SecOCRxPduProcessing | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Contains the parameters to configure the RxPdus to be verified by the SecOC module. |
| SecOCSameBufferPduCollection | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | SecOCBuffer configuration that may be used by a collection of Pdus. |
| SecOCTxPduProcessing | ECUC-PARAM-CONF-CONTAINER-DEF | [0..*] | Contains the parameters to configure the TxPdus to be secured by the SecOC module. |

## 전체 표준 Explorer
{% include components/standard-explorer.html module="SecOC" %}

## 개수와 조건의 해석
[1]은 해당 부모 아래 1개, [0..1]은 선택적으로 1개, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모·choice·variant 조건을 함께 읽어야 하며 optional parent의 자식을 ECU 전체에서 무조건 필수로 해석하지 않는다. MIN/MAX는 값 범위이며 multiplicity와 다르다.

## 기준과 범위
원본은 Classic AUTOSAR 4.2.2의 ECU Configuration Parameter Definitions다. 최신 release나 공급사 확장으로 확대 해석하지 않는다. Explorer에서 하위 container·parameter·reference와 원문 조건을 표로 확인할 수 있다.

## 이해를 확인하는 질문

> SecOC의 container 개수와 parameter 값의 범위는 어떻게 다른가?

Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.
