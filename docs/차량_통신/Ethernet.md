---
layout: default
title: Ethernet
has_children: true
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-12-14-10-00
nav_order: 7
parent: '차량 통신'
permalink: '/차량_통신/Ethernet'
redirect_from:
 - /3f71b412900a817b9e99f6616ada2231
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


자동차 Ethernet의 PHY·프레임·스위칭과 IP 상위 프로토콜을 구분해 정리한다.


## 적용 범위


IEEE 802.3 물리·MAC 계층과 IEEE 802.1 기능을 구분한다. 실제 구현 규격과 PHY 데이터시트를 확인한다.


## 본문


### 계층 구분


10BASE-T1S·100BASE-T1·1000BASE-T1은 물리 계층 규격이다. Ethernet 프레임·MAC 주소·스위칭은 링크 계층 관점이다. IP·TCP·UDP 및 서비스·진단 프로토콜은 별도 계층이다.


### 프레임과 스위칭


목적지·출발지 MAC, EtherType, 페이로드와 FCS를 구분한다. VLAN 태그를 사용할 경우 식별과 우선순위 설정을 확인한다. 스위치는 프레임을 전달하며 라우터는 IP 네트워크 사이의 전달을 다룬다.


### 토폴로지와 자동차 PHY


단일 페어 링크와 스위치 기반 구성, zonal/domain 구조, 게이트웨이와 연결 상태를 확인한다. 모든 single-pair Ethernet이 multidrop을 지원하는 것은 아니다.


### 성능과 지연


물리 링크 속도는 애플리케이션의 실제 처리량과 다르다. 패킷 크기, 오버헤드, 스위치 큐, 트래픽 경쟁, 손실·재전송과 호스트 처리가 지연에 영향을 준다.


### 분석 순서


PHY link 상태 → MAC·VLAN → IP 주소와 경로 → transport 연결 → 서비스 상태 → 애플리케이션 판정 순서로 문제를 좁힌다.


### 검증 항목

- link up/down과 복구.
- VLAN·주소·라우팅 설정의 일치.
- 패킷 손실·지연·지터·대역폭.
- 멀티캐스트·브로드캐스트의 영향.
- 진단·서비스·미디어 트래픽의 동시 부하.

### 실습: 계층별 연결 점검


Linux 예제 인터페이스 eth0를 사용한다. 실제 장치의 인터페이스 이름과 주소로 바꾼다.


```bash
ip -br link show
ip -br addr show eth0
ip route show
ethtool eth0
ip -s link show eth0
sudo tcpdump -i eth0 -nn -s0 -w capture.pcap
```



Link 상태와 주소·경로를 먼저 확인하고, 캡처에서 실제 요청·응답을 분석한다. Ping 성공은 서비스 정상 동작을 입증하지 않으며 ICMP를 차단하는 장치의 무응답도 link 실패와 구분한다.


### 장애 분석 예제


Link는 up인데 서비스가 보이지 않는 경우 VLAN·subnet·routing·multicast 설정 → transport 포트 → 서비스 제공 상태 순서로 확인한다. 스위치 포트 카운터와 송수신 캡처를 비교해 손실 지점을 좁힌다.

