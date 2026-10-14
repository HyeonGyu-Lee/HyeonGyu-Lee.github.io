---
layout: default
title: 100BASE-T1
has_children: false
published_date: 2026-10-12-13-10-00
last_modified_date: 2026-10-14-22-10-00
nav_order: 2
parent: 'Ethernet'
permalink: '/차량_통신/Ethernet/100BASE-T1'
redirect_from:
 - /3f71b412900a81ceaab7c7b0679fd3b0
 - /undefined
---
## Table of contents
{: .no_toc .text-delta }
- TOC
{:toc}
## 핵심 요약


> 단일 twisted pair의 100 Mbit/s point-to-point full-duplex 링크를 정리한다.


## 적용 범위


<blockquote class="notice">
<div class="callout">
<div class="callout-icon" markdown="1">
💡 
</div>
<div class="callout-content" markdown="1">
IEEE 802.3bw-2015와 적용 PHY·케이블 사양을 확인한다.
</div>
</div>
</blockquote>



## 본문


### 물리 연결


100BASE-T1은 하나의 페어로 양방향 통신하는 100 Mbit/s Ethernet PHY다. 전형적인 연결은 두 PHY 사이의 point-to-point 링크이며 multidrop 공유 버스로 해석하지 않는다.


### 구성


PHY의 master/slave 역할, link 상태, 전원 상태, 인터페이스와 케이블 조건을 확인한다. 역할은 link 구성의 용어이며 애플리케이션 서비스 제공자·소비자와 동일하지 않다.


### 분석


Link up은 IP나 서비스의 정상 동작을 보장하지 않는다. PHY 오류·MAC 프레임·VLAN·IP·서비스를 계층별로 확인한다. 저전력·wakeup 기능은 추가 규격과 제품 지원을 확인한다.


### 검증

- 정상 link 수립과 역할 설정 오류.
- 케이블·커넥터 상태와 전원 재인가.
- 연속·동시 트래픽의 손실·지연.
- switch·gateway 연결과 복구.
- PHY 적합성 시험과 애플리케이션 기능 시험을 구분.

### 실습: link와 애플리케이션 분리


PHY 평가보드 두 개를 연결하고 역할 설정과 link 상태를 제조사 도구에서 확인한다. 두 호스트의 IP를 같은 subnet으로 구성한 뒤 양방향 패킷을 캡처한다.


iperf3를 제공하는 시험 호스트를 사용하는 경우:


```bash
# 수신 측
iperf3 -s
# 송신 측: 시험용 사설 주소를 실제 상대 주소로 변경
iperf3 -c 192.168.10.2 -t 30
iperf3 -c 192.168.10.2 -u -b 20M -t 30
```



이 시험의 throughput·loss·jitter 결과는 PHY 적합성 인증을 대신하지 않는다. 전원 재인가와 cable reconnect 후 link 복구와 서비스 복구 시간을 따로 확인한다.

