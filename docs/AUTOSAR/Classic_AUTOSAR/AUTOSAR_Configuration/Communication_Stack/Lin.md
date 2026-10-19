---
layout: default
title: Lin
has_children: false
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 31
parent: 'Communication Stack'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack/Lin'
redirect_from:
 - "/3f91b412900a8180a065fe778a193148"
 - "/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Lin"
---
## Lin의 책임을 데이터 의미와 전송 계층 관점에서 구분하는 상황


Signal·I-PDU, routing, transport, interface와 driver는 같은 traffic을 다른 경계에서 다룬다. Configuration reference는 그 경계를 연결하며, network state와 실제 데이터 전송 상태도 구분된다. Lin의 최상위 정의에는 LinDemEventParameterRefs, LinGeneral, LinGlobalConfig 등이 있다. Container의 이름, description과 reference를 함께 보면 module 내부 설정과 외부 연결을 구분할 수 있다.


## LIN Driver와 LIN Stack


> Lin은 LIN hardware에 접근하는 driver이며, schedule과 frame 처리, 상태 관리 및 transport는 관련 상위 module과 역할을 나눈다.


## 책임과 주변 모듈


| 영역      | 의미                                       |
| ------- | ---------------------------------------- |
| Lin     | LIN hardware와 driver interface           |
| LinIf   | LIN frame·schedule 및 상위 interface 관련 추상화 |
| LinSM   | LIN 통신 상태와 mode의 조정                      |
| LinTp   | 진단 payload의 transport 기능                 |
| LinTrcv | 외부 LIN transceiver 접근의 추상화               |


## 표준 Configuration Explorer


{% include components/standard-explorer.html module="Lin" %}


현재 표시하는 기준은 Classic AUTOSAR 4.2.2 ECUC 원본이다. 다른 release의 항목이나 공급사 확장을 같은 정의로 취급하지 않는다. 이름을 선택하면 description과 원본 metadata를 확인할 수 있다.


## 표준 구조를 읽는 관점


Container는 의미 단위, parameter는 그 안의 값 정의, reference는 다른 구성과의 관계다. 데이터 type과 값 범위, 개수 범위, variant 조건을 구분한다. Module이 정의돼 있다는 사실만으로 특정 ECU에 그 module이 필수라는 뜻은 아니다.


## Multiplicity와 조건


[1]은 해당 부모 아래 정확히 하나, [0..1]은 선택적으로 하나, [0..*]는 0개 이상, [1..*]는 1개 이상이다. 부모가 선택 구성이라면 그 자식의 [1]을 ECU 전체의 필수로 확대 해석하지 않는다. 조건·choice와 configuration class는 원본 metadata에서 함께 확인한다.


## 이해를 확인하는 질문


> Lin의 container 개수와 parameter 값의 범위는 어떻게 다른가?


Multiplicity는 부모 instance마다 허용되는 구성 개수다. MIN/MAX·default·enum은 값의 범위를 설명한다. Reference의 대상과 variant 조건까지 함께 읽어야 실제 ECU 설정의 허용 범위를 알 수 있다.

