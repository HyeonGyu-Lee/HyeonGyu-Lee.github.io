---
layout: default
title: "Communication Stack"
has_children: true
parent: "AUTOSAR Configuration"
nav_order: 7
permalink: '/AUTOSAR/Classic_AUTOSAR/AUTOSAR_Configuration/Communication_Stack'
last_modified_date: 2026-10-14T16:38:00.000Z
redirect_from:
 - "/3f91b412900a8131a1c6cfabc5554b17"
---

## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}

## Communication Stack의 구성
> 같은 기능 영역 안에서도 driver·interface·manager·service의 책임을 구분해서 읽는다.

| 모듈 | 역할 |
| --- | --- |
| Can | CAN controller와 hardware object를 다루는 MCAL driver. CanIf·CanTp·CanNm의 상위 책임과 구분한다. |
| CanIf | 상위 통신 module과 CAN driver 사이 interface. Controller와 PDU 관계를 추상화한다. |
| CanNm | CAN network management의 network 상태와 관련 message 처리를 다룬다. CAN frame 송수신 driver나 application signal routing 기능과 구분한다. |
| CanSM | CAN communication mode와 controller/transceiver 관련 상태 전환을 조정한다. CanNm의 network management protocol과 역할이 다르다. |
| CanTSyn | CAN을 통한 time synchronization의 protocol 관련 책임을 다룬다. Local time base 관리와 bus상의 시간 전달을 구분한다. |
| CanTp | CAN에서 큰 payload를 분할·재조립하는 transport protocol module. CAN hardware frame 자체를 송수신하는 Can driver와 다른 계층이다. |
| CanTrcv | 외부 CAN transceiver의 mode·wake-up 등 hardware 제어를 추상화한다. |
| Com | Application signal과 I-PDU의 통신 표현·처리를 담당한다. CAN 전용 module이 아니며 routing 자체는 PduR 등과 역할을 나눈다. |
| ComM | 사용자의 communication 요청과 network의 communication mode를 조정한다. Protocol별 state manager 및 network management와 구분한다. |
| DoIP | Diagnostics over Internet Protocol. Ethernet/IP 기반 진단의 주소·연결·전달 책임을 다룬다. UDS service 내용은 Dcm 등 상위 기능과 구분한다. |
| Eth | Ethernet controller driver. MAC/controller hardware 접근을 다루며 TCP/IP나 socket service와는 다른 계층이다. |
| EthIf | Ethernet driver와 상위 stack 사이 interface 및 controller 연결을 추상화한다. |
| EthSM | Ethernet communication 상태와 mode 전환을 조정한다. |
| EthSwt | Ethernet switch hardware와 관련 설정을 다루는 driver 영역이다. Endpoint의 Eth controller와 구분한다. |
| EthTSyn | Ethernet을 통한 time synchronization의 protocol 관련 기능을 다룬다. StbM의 local/synchronized time base 관리와 구분한다. |
| EthTrcv | Ethernet transceiver/PHY 관련 hardware 접근과 mode를 추상화한다. |
| Fr | FlexRay controller driver. Hardware channel과 frame 접근을 다루는 MCAL 계층이다. |
| FrArTp | FlexRay AUTOSAR transport protocol 관련 기능을 다룬다. FrTp와 이름만으로 동일 구현이라고 가정하지 않는다. |
| FrIf | FlexRay interface. 상위 통신과 FlexRay driver 사이 구성·접근 차이를 추상화한다. |
| FrNm | FlexRay network management. Network 상태와 network management 통신의 책임을 다룬다. |
| FrSM | FlexRay communication state manager. Cluster의 communication mode와 상태 조정을 다룬다. |
| FrTSyn | FlexRay를 통한 time synchronization 관련 기능을 다룬다. |
| FrTp | FlexRay transport protocol. 상위 payload와 FlexRay 통신 사이 transport 처리를 다룬다. |
| FrTrcv | FlexRay transceiver hardware의 mode 등 접근을 추상화한다. |
| IpduM | I-PDU Multiplexer. 여러 I-PDU 표현의 multiplexing 관련 기능을 담당하며 Com의 signal 처리와 구분한다. |
| J1939Dcm | J1939 diagnostic communication 관련 service 처리를 다룬다. UDS 중심 Dcm과 같은 service 집합이라고 가정하지 않는다. |
| J1939Nm | J1939 network management와 address claim 관련 구성을 다룬다. |
| J1939Rm | J1939 Request Manager. J1939 request 관련 처리를 조정하는 책임을 다룬다. |
| J1939Tp | J1939 transport protocol. J1939 메시지의 큰 payload 전송에 필요한 transport 책임을 다룬다. |
| LdCom | Large Data COM. 큰 data의 communication interface 관련 기능을 다루며 일반 Com의 signal 처리와 구분한다. |
| Lin | LIN hardware driver. Schedule·network 상태·transport의 상위 책임은 LinIf·LinSM·LinTp 등과 나눈다. |
| LinIf | LIN interface. LIN frame/schedule와 driver·상위 기능 사이의 연결을 다룬다. |
| LinNm | LIN network management 관련 구성을 다룬다. CAN network management의 frame·state 구성을 그대로 적용하지 않는다. |
| LinSM | LIN communication 상태와 mode 전환을 조정한다. |
| LinTp | LIN diagnostic payload의 transport 기능을 다룬다. |
| LinTrcv | LIN transceiver hardware 제어를 추상화한다. |
| Nm | Generic Network Management interface. Bus-specific network management와 상위 사용자를 연결하는 공통 계층이다. |
| PduR | PDU Router. 구성된 경로에 따라 PDU를 상위·하위 통신 module 사이에 전달한다. Application signal의 물리적 의미를 해석하는 역할과 구분한다. |
| Sd | Service Discovery. Service 제공·발견·event subscription 관련 network 수준의 discovery 기능을 다룬다. |
| SoAd | Socket Adaptor. 상위 PDU 기반 통신과 TCP/IP socket 기반 통신 사이의 연결을 다룬다. |
| TcpIp | TCP/IP stack 관련 기능과 구성을 다룬다. Ethernet MAC driver나 application service 의미와는 다른 계층이다. |
| UdpNm | UDP 기반 network management. 일반적인 UDP data socket의 application 통신과 구분한다. |
| Xfrm | Transformer 관련 구성. 통신 data 표현의 변환과 관련된 정의를 다루며 PDU 경로 선택 자체와 구분한다. |

## 표준 범위
이 분류는 탐색을 위한 문서 묶음이며 AUTOSAR의 공식 layer 구성을 대체하지 않는다. 각 페이지와 Explorer는 저장소의 Classic AUTOSAR 4.2.2 ECUC 정의를 기준으로 한다.
