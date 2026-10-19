---
layout: default
title: "차량 Ethernet 상위 프로토콜"
has_children: false
published_date: 2026-10-12T04:27:00.000Z
last_modified_date: 2026-10-14T13:25:00.000Z
nav_order: 4
parent: "Ethernet"
permalink: '/차량_통신/Ethernet/차량_Ethernet_상위_프로토콜'
redirect_from:
 - "/3f71b412900a817e99e6e3bea577cd4b"
---

## Ethernet frame 안에서 application data를 찾는 상황

L2 frame, IP packet, UDP datagram·TCP stream과 service message는 서로 다른 경계다. Address, routing, segmentation과 serialization을 분리하면 어느 단계에서 data가 달라졌는지 알 수 있다.

> Ethernet 위의 주소·전송·서비스 계층을 구분해 패킷을 분석한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡
</div>
<div class="callout-content" markdown="1">
일반적인 IP 네트워크 개념. 실제 IPv4·IPv6, 주소·VLAN·포트 정책은 시스템 사양을 따른다.
</div>
</div>
</blockquote>





### IP와 주소


IP 주소·서브넷·라우팅을 확인한다. IPv4의 ARP와 IPv6의 Neighbor Discovery는 링크 내 주소 해석 등의 역할을 한다. MAC 주소와 IP 주소는 다른 계층의 식별자다.


### UDP와 TCP


UDP는 datagram 중심이며 전송 자체가 수신·순서·재전송을 보장하지 않는다. TCP는 연결 기반 byte stream으로 순서와 재전송을 제공하지만 애플리케이션 처리 완료와 메시지 경계를 자동 보장하지 않는다.


### 멀티캐스트와 탐색


서비스 탐색이나 그룹 전송의 실제 구성에서 multicast 주소, 수신 가입, 스위치·네트워크 정책을 확인한다. VLAN이나 multicast 설정 불일치는 link가 정상이어도 서비스가 보이지 않는 원인이 될 수 있다.


### MTU와 데이터 크기


큰 페이로드는 전송·분할 방식과 MTU의 영향을 받는다. IP fragmentation, 애플리케이션 segmentation과 CAN ISO-TP를 서로 같은 것으로 취급하지 않는다.


### 분석 순서


프레임의 VLAN·MAC → IP 주소·경로 → transport 포트·연결 → 서비스 ID·요청 ID → 애플리케이션 결과 순서로 상관관계를 확인한다.


### 검증

- 주소·VLAN·포트 설정 오류.
- 연결 실패·종료·재시작과 복구.
- 손실·중복·순서·타임아웃 처리.
- unicast·multicast의 목적지와 정책.

### 실습: 패킷을 단계별로 필터링


Wireshark display filter 예제:


```text
arp
ip.addr == 192.168.10.2
udp.port == 30490
tcp.analysis.retransmission
vlan.id == 100
```



UDP 30490은 흔히 사용하는 SOME/IP-SD 포트 예시이며 프로젝트 설정을 우선한다. 재전송 필터 결과는 loss뿐 아니라 캡처 조건과 분석 한계도 함께 확인한다.


### 실습: UDP 데이터 경계


UDP datagram 하나와 애플리케이션 메시지의 관계를 먼저 정의한다. TCP로 옮기면 read 호출 한 번이 메시지 하나라는 가정이 성립하지 않으므로 길이 prefix 등 framing 규칙을 적용한다.

## 이해를 확인하는 질문

> TCP read 한 번이 SOME/IP message 하나와 일치할까?

TCP는 byte stream이다. Message length를 해석해 누적·분리하고 partial read와 여러 message의 동시 도착을 처리한다.
