---
layout: default
title: AUTOSAR
has_children: true
published_date: 2024-06-03-08-06-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 1
permalink: '/AUTOSAR'
redirect_from:
 - "/e20f9e7df0d34378beea96efa4172089"
---
## 서로 다른 ECU와 공급사의 software를 연결하는 상황


AUTOSAR는 Application과 platform의 책임 및 interface를 표준화한다. Classic과 Adaptive는 실행 환경과 구성 방식이 다르며 Foundation은 두 platform이 공유하는 규격을 제공한다.


## AUTOSAR가 해결하려는 문제


> AUTOSAR는 ECU 소프트웨어를 구성하는 기능의 경계와 교환 가능한 기술 정보를 표준화한다. 핵심은 특정 운영체제나 통신 프로토콜 하나가 아니라, application·platform·hardware 사이의 책임을 분리하는 데 있다.


자동차 기능이 여러 ECU와 공급사에 분산되면 같은 기능도 hardware, 통신 stack, 설정 도구에 따라 다시 통합해야 한다. AUTOSAR는 software component, interface, configuration description과 기본 소프트웨어의 역할을 정의해 이 결합을 줄이려는 접근이다. 표준을 채택했다는 사실만으로 안전성·실시간성·상호운용성이 자동으로 보장되는 것은 아니다.


## 세 가지 표준 영역


| 영역                | 중심 질문                                         | 주요 관점                                              |
| ----------------- | --------------------------------------------- | -------------------------------------------------- |
| Classic Platform  | 제한된 자원의 제어 ECU에서 기능을 어떻게 일관되게 구성하는가?          | SWC·RTE·BSW·MCAL, 정적 구성과 제어 중심 실행                  |
| Adaptive Platform | 고성능 ECU에서 독립 application과 service를 어떻게 관리하는가? | Process·service·execution/state·software lifecycle |
| Foundation        | 서로 다른 platform이 어떤 공통 계약으로 연결되는가?             | 공통 protocol·방법론·상호운용성에 필요한 정의                      |


Classic과 Adaptive는 이전·이후 버전 관계가 아니다. 빠르고 예측 가능한 제어와 고성능 연산·서비스 구성은 요구가 다르므로 차량 안에서 함께 사용될 수 있다. MCU=Classic, AP=Adaptive라는 단순 등식도 성립하지 않는다. 실제 플랫폼 채택은 제품 요구와 software stack에 의해 결정된다.


## Classic이 나누는 책임


| 계층              | 책임                                                    |
| --------------- | ----------------------------------------------------- |
| Application     | 차량 기능을 SWC와 interface로 표현                             |
| RTE             | SWC 간 통신과 SWC–BSW 접점을 구성에 맞게 연결                       |
| Services        | OS·통신·진단·메모리 등 ECU 공통 기능                              |
| ECU Abstraction | ECU의 부품 배치와 외부 device 연결 차이를 추상화                      |
| MCAL            | MCU 내부 peripheral과 hardware register 차이를 상위 계층으로부터 분리 |
| Complex Drivers | 표준 interface만으로 수용하기 어려운 특정 hardware·timing 요구를 통합    |


이 계층도는 모든 함수 호출이 반드시 한 층씩 통과한다는 뜻이 아니다. Module별 허용 interface와 resource ownership은 각 규격에서 정의한다.


## Adaptive가 분리하는 책임


Adaptive는 application process의 실행과 상태, service 통신, 지속 데이터, 진단, software update와 보안 관련 기능을 functional cluster 관점에서 다룬다. 서로 다른 cluster가 제공하는 API와 platform configuration을 조합해 application을 배치한다. Functional cluster를 반드시 하나의 독립 OS process와 동일시하지 않는다.


## 표준의 발전을 보는 흐름


| 변화의 배경                    | 표준을 읽는 관점                                                           |
| ------------------------- | ------------------------------------------------------------------- |
| 제어 ECU의 복잡성과 공급사 간 재사용    | Application interface와 hardware 의존 부분을 분리                           |
| 차량 network와 진단·메모리 서비스 확대 | 통신·진단·저장 module의 책임과 configuration 관계 정교화                           |
| 고성능 연산과 연결 기능 확대          | Process·service 기반 Adaptive 영역 등장                                   |
| 두 platform의 공존            | 공통 protocol, service/data 의미와 platform 경계의 명확화                      |
| 제품 수명 동안 software 변경      | Application lifecycle, configuration·compatibility·security의 중요성 증가 |


## Release와 제품 version의 차이


AUTOSAR release는 표준 문서 집합의 기준선이다. BSW/AP 공급사의 제품 version, generator version, compiler version과 동일하지 않다. 같은 표준 release를 기반으로 해도 지원 subset, 확장 기능과 제한이 다를 수 있다. Document version과 AUTOSAR release 표기 또한 구분해야 한다.


## 릴리스 문서를 읽는 구조


| 문서 종류                                   | 알 수 있는 내용                                         |
| --------------------------------------- | ------------------------------------------------- |
| Release Overview / 해당 문서 Change History | 변경 항목과 적용 시점                                      |
| Platform Design / 설명 문서                 | 아키텍처의 목적과 기능 사이의 관계                               |
| SWS                                     | Module·functional cluster의 동작과 interface 요구사항     |
| ECU Configuration Parameter Definitions | Classic 설정 구조, parameter, reference, multiplicity |
| Methodology / Template                  | 모델과 교환 정보의 의미                                     |


페이지에 표시된 Explorer는 저장소의 AUTOSAR 4.2.2 ECUC 원본을 보여준다. 이것을 최신 Classic 또는 Adaptive 전체 규격으로 해석하지 않는다.


## 이해를 확인하는 질문


> 같은 AUTOSAR 표준을 쓰면 모든 software가 그대로 호환될까?


Release, interface, data type과 공급사 구현의 지원 범위가 맞아야 한다. 표준화는 구성과 통합의 필요성을 없애지 않는다.

