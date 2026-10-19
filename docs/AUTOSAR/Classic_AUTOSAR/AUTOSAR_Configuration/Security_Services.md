---
layout: default
title: Security Services
has_children: true
published_date: 2026-10-15-01-10-00
last_modified_date: 2026-10-19-13-10-00
nav_order: 5
parent: 'AUTOSAR Configuration'
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Security_Services'
redirect_from:
 - "/3f91b412900a81b8a89ce80c77d57cbc"
---
## 암호 연산과 보호 정책를 모듈별로 나누는 상황


암호 primitive, key 사용 정책과 PDU 보호는 서로 다른 책임이다. Module의 interface는 그 책임을 연결하며 hardware 저장·연산 방식과 application의 보호 목적을 구분한다.


## Security Services의 구성


> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.


| 모듈    | 역할                                                                                                                                  |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Cal   | Cryptographic Abstraction Library. 암호 기능의 library 추상화를 다루며 Csm의 service/job 관리 관점과 구분한다. 이후 release의 crypto stack 구성을 그대로 대입하지 않는다. |
| Csm   | Crypto Service Manager. 상위 사용자의 암호 서비스 요청과 하위 암호 기능 사이의 관리 계층을 다룬다.                                                                 |
| SecOC | Secure Onboard Communication. Authenticity·integrity·freshness 관련 보호를 PDU 통신에 연결한다. 일반적인 payload encryption과 동일하지 않다.               |


## 표준 범위


이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.


## 이해를 확인하는 질문


> 같은 그룹의 모듈을 하나의 책임으로 합쳐도 될까?


그룹은 탐색을 위한 분류다. 실제 API·configuration·state의 경계는 개별 module이 정의하므로 각 책임과 연결을 따로 확인한다.

